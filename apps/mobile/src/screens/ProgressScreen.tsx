import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import styles from './ProgressScreenStyles';
import { colors } from '../theme/colors';
import { StepCounter } from '../components/StepCounter';
import { UserService } from '../services/userService';
import api from '../services/api';
import { LeaderboardEntry } from '@tier1fitness_app/types';

// --- SUB-COMPONENTS ---

const StatCard = ({ icon, label, value, subValue, color, fullWidth = false }: any) => (
  <View style={[styles.statCard, fullWidth && styles.fullWidthCard]}>
    <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
      <Ionicons name={icon} size={24} color={color} />
    </View>
    <View style={styles.statInfo}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
      {subValue && <Text style={styles.statSub}>{subValue}</Text>}
    </View>
  </View>
);

const LeaderboardRow = ({ entry, isMe }: { entry: LeaderboardEntry, isMe: boolean }) => (
  <View style={[styles.rankRow, isMe && styles.rankRowHighlight]}>
    <View style={styles.rankNumberContainer}>
      <Text style={[styles.rankNumber, isMe && { color: colors.primary }]}>{entry.rank}</Text>
    </View>
    <Image source={{ uri: entry.user.profilePicUrl }} style={styles.avatar} />
    <View style={{ flex: 1 }}>
      <Text style={[styles.rankUsername, isMe && { color: colors.primary }]}>
        {entry.user.username} {isMe && '(You)'}
      </Text>
    </View>
    <Text style={styles.rankScore}>{entry.score.toLocaleString()}</Text>
  </View>
);

// --- MAIN SCREEN ---

export const ProgressScreen = () => {
  const insets = useSafeAreaInsets();
  const [stats, setStats] = useState({ steps: 0, calories: 0, distance: 0 });
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<string>('-'); 
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);

  const STEP_GOAL = 10000;
  const progressPercent = Math.min(stats.steps / STEP_GOAL, 1) * 100;

  const fetchData = async () => {
    // 1. Get User
    let userId = (await UserService.getUser())?.id;
    if (userId) setCurrentUserId(userId);

    try {
      // 2. Fetch Leaderboard
      const data: LeaderboardEntry[] = await api.get('/leaderboard');
      setLeaderboard(data);

      // 3. Find Rank
      if (userId) {
        const myEntry = data.find(entry => entry.user.id === userId);
        setUserRank(myEntry ? `#${myEntry.rank}` : '> 10');
      }
    } catch (e) {
      console.error('Failed to fetch data', e);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Logic: Updates local step stats */}
      <StepCounter 
        onDataUpdate={(data) => setStats({ 
          steps: data.currentSteps, 
          calories: data.calories, 
          distance: data.distance 
        })} 
      />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Progress & Rankings</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary}/>}
      >
        {/* --- PERSONAL GOAL --- */}
        <View style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <Text style={styles.goalTitle}>Daily Steps</Text>
            <Text style={styles.goalPercent}>{Math.round(progressPercent)}%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
          <View style={styles.goalStats}>
            <Text style={styles.currentSteps}>{stats.steps.toLocaleString()}</Text>
            <Text style={styles.totalGoal}>/ {STEP_GOAL.toLocaleString()}</Text>
          </View>
        </View>

        {/* --- PERSONAL STATS GRID --- */}
        <View style={styles.gridContainer}>
          <StatCard icon="flame" label="Calories" value={stats.calories} subValue="kcal" color="#EF4444" />
          <StatCard icon="map" label="Distance" value={stats.distance} subValue="km" color="#10B981" />
        </View>

        <StatCard 
          fullWidth icon="trophy" label="Current Rank" value={userRank} 
          subValue="Global Leaderboard" color="#F59E0B" 
        />

        {/* --- LEADERBOARD SECTION --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Movers Today</Text>
        </View>

        <View style={styles.leaderboardCard}>
          {leaderboard.length === 0 ? (
            <Text style={{ color: colors.textSecondary, textAlign: 'center', padding: 20 }}>
              No data yet. Start walking!
            </Text>
          ) : (
            leaderboard.map((entry) => (
              <LeaderboardRow 
                key={entry.user.id} 
                entry={entry} 
                isMe={entry.user.id === currentUserId} 
              />
            ))
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};