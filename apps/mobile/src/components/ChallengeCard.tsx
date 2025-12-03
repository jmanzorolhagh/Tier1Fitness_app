import React, { useState, useEffect } from 'react';
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
  const [joined, setJoined] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      const user = await UserService.getUser();
      if (user) {
        setCurrentUserId(user.id);
        
        if (challenge.participantIds?.includes(user.id)) {
          setJoined(true);
        }
      }
    };
    checkStatus();
  }, [challenge]); 

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleJoin = async () => {
    if (!currentUserId) {
      Alert.alert("Login Required", "Please log in to join challenges.");
      return;
    }

    setJoining(true);
    try {
      await api.post('/challenges/join', {
        userId: currentUserId,
        challengeId: challenge.id
      });
      
      setJoined(true);
      Alert.alert("Success", "You have joined the challenge! 🚀");
      if (onJoinSuccess) onJoinSuccess();
      
    } catch (e: any) {
      if (e.message?.includes("Already joined")) {
        setJoined(true); 
      } else {
        Alert.alert("Error", e.message || "Failed to join.");
      }
    } finally {
      setJoining(false);
    }
  };

  const goalIcon = challenge.goalType === 'STEPS' ? 'footsteps' : 'flame';
  const goalColor = challenge.goalType === 'STEPS' ? colors.primary : colors.accent;

  const progress = joined ? 0.15 : 0; 
  const percent = Math.round(progress * 100);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconBadge, { backgroundColor: goalColor + '20' }]}>
          <Ionicons name={goalIcon as any} size={20} color={goalColor} />
        </View>
        <View style={styles.metaContainer}>
          <Text style={styles.title}>{challenge.title}</Text>
          <Text style={styles.dates}>
            {formatDate(challenge.startDate)} - {formatDate(challenge.endDate)}
          </Text>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {challenge.description}
      </Text>

      <View style={{ flexDirection: 'row', marginBottom: 16, alignItems: 'center' }}>
        <Text style={{ color: colors.textSecondary, fontWeight: '600', marginRight: 6 }}>Target:</Text>
        <Text style={{ color: colors.text, fontWeight: 'bold' }}>
          {challenge.goalValue.toLocaleString()} {challenge.goalType === 'STEPS' ? 'Steps' : 'Calories'}
        </Text>
      </View>

      {joined ? (
        <View style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>Your Progress</Text>
            <Text style={{ color: goalColor, fontWeight: 'bold', fontSize: 12 }}>{percent}%</Text>
          </View>
          <View style={{ height: 8, backgroundColor: '#0F172A', borderRadius: 4, overflow: 'hidden' }}>
            <View style={{ width: `${percent}%`, height: '100%', backgroundColor: goalColor }} />
          </View>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.joinButton} 
          onPress={handleJoin}
          disabled={joining}
        >
          {joining ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.joinButtonText}>Join Challenge</Text>
          )}
        </TouchableOpacity>
      )}

      <View style={styles.footer}>
        <View style={styles.creatorContainer}>
          <Image source={{ uri: challenge.creator.profilePicUrl }} style={styles.avatar} />
          <Text style={styles.creatorName}>Host: {challenge.creator.username}</Text>
        </View>
        <View style={styles.statsContainer}>
          <Ionicons name="people" size={16} color={colors.textSecondary} />
          <Text style={styles.participantCount}>{challenge.participantCount}</Text>
        </View>
      </View>
    </View>
  );
};