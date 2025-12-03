import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Challenge } from '@tier1fitness_app/types';
import { styles } from './ChallengeCardStyles';
import { colors } from '../theme/colors';
import api from '../services/api';
import { UserService } from '../services/userService';

interface ChallengeCardProps {
  challenge: Challenge;
  onJoinSuccess?: () => void;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, onJoinSuccess }) => {
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false); // Local state for immediate UI feedback

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleJoin = async () => {
    const user = await UserService.getUser();
    if (!user) {
      Alert.alert("Login Required", "Please log in to join challenges.");
      return;
    }

    setJoining(true);
    try {
      await api.post('/challenges/join', {
        userId: user.id,
        challengeId: challenge.id
      });
      
      setJoined(true);
      Alert.alert("Success", "You have joined the challenge! 🚀");
      if (onJoinSuccess) onJoinSuccess();
      
    } catch (e: any) {
      // If error is "Already joined", just update UI
      if (e.message?.includes("Already joined")) {
        setJoined(true);
        Alert.alert("Info", "You are already in this challenge.");
      } else {
        Alert.alert("Error", e.message || "Failed to join.");
      }
    } finally {
      setJoining(false);
    }
  };

  return (
    <View style={styles.card}>
      {/* Header / Banner area */}
      <View style={styles.header}>
        <View style={styles.iconBadge}>
          <Ionicons name="trophy" size={20} color="#F59E0B" />
        </View>
        <View style={styles.metaContainer}>
          <Text style={styles.title}>{challenge.title}</Text>
          <Text style={styles.dates}>
            {formatDate(challenge.startDate)} - {formatDate(challenge.endDate)}
          </Text>
        </View>
      </View>

      {/* Description */}
      <Text style={styles.description} numberOfLines={2}>
        {challenge.description}
      </Text>

      {/* Footer: Creator & Stats */}
      <View style={styles.footer}>
        <View style={styles.creatorContainer}>
          <Image 
            source={{ uri: challenge.creator.profilePicUrl }} 
            style={styles.avatar} 
          />
          <Text style={styles.creatorName}>Host: {challenge.creator.username}</Text>
        </View>

        <View style={styles.statsContainer}>
          <Ionicons name="people" size={16} color={colors.textSecondary} />
          <Text style={styles.participantCount}>{challenge.participantCount}</Text>
        </View>
      </View>

      {/* Join Button */}
      <TouchableOpacity 
        style={[styles.joinButton, joined && styles.joinedButton]} 
        onPress={handleJoin}
        disabled={joining || joined}
      >
        {joining ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <Text style={styles.joinButtonText}>
            {joined ? "Joined ✓" : "Join Challenge"}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};