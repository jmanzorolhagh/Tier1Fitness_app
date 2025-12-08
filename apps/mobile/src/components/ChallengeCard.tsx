import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Challenge } from '@tier1fitness_app/types';
import { styles } from './ChallengeCardStyles';
import { colors } from '../theme/colors';
import api from '../services/api';
import { UserService } from '../services/userService';
import { RootStackParamList } from '../navigation/AppNavigator';

const SUCCESS_COLOR = '#10B981';

interface ChallengeCardProps {
  challenge: Challenge & { currentProgress?: number }; 
  onJoinSuccess?: () => void;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, onJoinSuccess }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
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
      Alert.alert("Welcome Aboard!", "You've joined the team.");
      if (onJoinSuccess) onJoinSuccess();
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to join.");
    } finally {
      setJoining(false);
    }
  };

  const goToDetails = () => {
    navigation.navigate('ChallengeDetails', { challengeId: challenge.id });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isSteps = challenge.goalType === 'STEPS';
  const themeColor = isSteps ? colors.primary : colors.accent;
  
  const current = challenge.currentProgress || 0;
  const target = challenge.goalValue;
  
  const rawPercent = (current / target) * 100;
  const percentValue = Math.min(rawPercent, 100);
  const percentDisplay = Math.min(Math.round(rawPercent), 100); 
  const isCompleted = current >= target;

  const activeColor = isCompleted ? SUCCESS_COLOR : themeColor;
  const goalIcon = isSteps ? 'footsteps' : 'flame';

  return (
    <TouchableOpacity 
      style={[
        styles.card,
        isCompleted && { 
            backgroundColor: activeColor + '15', 
            borderColor: activeColor,
            borderWidth: 1
        }
      ]} 
      activeOpacity={0.9} 
      onPress={goToDetails}
    >
      <View style={styles.header}>
        <View style={[styles.iconBadge, { backgroundColor: activeColor + '20' }]}>
          <Ionicons name={goalIcon as any} size={20} color={activeColor} />
        </View>
        <View style={styles.metaContainer}>
          <Text style={styles.title}>{challenge.title}</Text>
          <Text style={styles.dates}>
            {formatDate(challenge.startDate)} - {formatDate(challenge.endDate)}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {challenge.description}
      </Text>

      <View style={{ marginTop: 12, marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
          <Text style={{ color: colors.textSecondary, fontSize: 12, fontWeight: '600' }}>
            Team Progress
          </Text>
          
          {isCompleted ? (
             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: activeColor, fontWeight: 'bold', fontSize: 12 }}>
                   GOAL ACHIEVED! 🏆
                </Text>
             </View>
          ) : (
             <Text style={{ color: activeColor, fontWeight: 'bold', fontSize: 12 }}>
                {percentDisplay}%
             </Text>
          )}
        </View>
        
        <View style={{ height: 10, backgroundColor: colors.background, borderRadius: 5, overflow: 'hidden' }}>
          <View style={{ 
            width: `${percentValue}%`, 
            height: '100%', 
            backgroundColor: activeColor,
            borderRadius: 5 
          }} />
        </View>

        <Text style={{ color: colors.textSecondary, fontSize: 11, marginTop: 4, textAlign: 'right' }}>
          {current.toLocaleString()} / {target.toLocaleString()} {isSteps ? 'Steps' : 'Cals'}
        </Text>
      </View>

      {!joined && !isCompleted && (
        <TouchableOpacity 
          style={styles.joinButton} 
          onPress={handleJoin}
          disabled={joining}
        >
          {joining ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.joinButtonText}>Join Team Challenge</Text>
          )}
        </TouchableOpacity>
      )}

      <View style={[styles.footer, (joined || isCompleted) && { marginTop: 0 }]}>
        <View style={styles.creatorContainer}>
          <Image source={{ uri: challenge.creator.profilePicUrl }} style={styles.avatar} />
          <Text style={styles.creatorName}>Host: {challenge.creator.username}</Text>
        </View>
        <View style={styles.statsContainer}>
          <Ionicons name="people" size={16} color={colors.textSecondary} />
          <Text style={styles.participantCount}>{challenge.participantCount} Participants</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};