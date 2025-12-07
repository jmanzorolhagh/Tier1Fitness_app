import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import styles from './ProgressScreenStyles';
import { colors } from '../theme/colors';
import { StepCounter } from '../components/StepCounter';
import { VictoryChart } from '../components/VictoryChart';
import { UserService } from '../services/userService';
import api from '../services/api';
import { LeaderboardEntry } from '@tier1fitness_app/types';

// UI Colors
const SUCCESS_COLOR = '#10B981';

// High Contrast Chart Colors
const NEON_GREEN = '#4ADE80';
const NEON_BLUE = '#60A5FA';

const StatCard = ({ icon, label, value, subValue, color, fullWidth = false }: any) => (
  <View style={[styles.statCard, fullWidth && styles.fullWidthCard]}>
    <View style={[
      styles.iconContainer, 
      { backgroundColor: color + '20' },
      fullWidth && { marginBottom: 0, marginRight: 16 } 
    ]}>
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

export const ProgressScreen = () => {
  const insets = useSafeAreaInsets();
  const [stats, setStats] = useState({ steps: 0, calories: 0, distance: 0 });
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [history, setHistory] = useState<{ label: string; steps: number }[]>([]);
  const [userRank, setUserRank] = useState<string>('-'); 
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);

  const STEP_GOAL = 10000;
  
  const rawPercent = (stats.steps / STEP_GOAL) * 100;
  const progressPercent = Math.min(rawPercent, 100);
  const displayPercent = Math.min(Math.round(rawPercent), 100);
  
  const isGoalMet = stats.steps >= STEP_GOAL;
  
  const uiActiveColor = isGoalMet ? SUCCESS_COLOR : colors.primary;
  const chartActiveColor = isGoalMet ? NEON_GREEN : NEON_BLUE;

  const fetchData = async () => {
    let userId = (await UserService.getUser())?.id;
    if (userId) setCurrentUserId(userId);

    try {
      const data: LeaderboardEntry[] = await api.get('/leaderboard');
      setLeaderboard(data);

      if (userId) {
        const myEntry = data.find(entry => entry.user.id === userId);
        setUserRank(myEntry ? `#${myEntry.rank}` : '> 10');

        if (myEntry && myEntry.score > stats.steps) {
            setStats(prev => ({
                ...prev,
                steps: myEntry.score,
                calories: prev.calories === 0 ? Math.floor(myEntry.score * 0.04) : prev.calories, 
                distance: prev.distance === 0 ? parseFloat((myEntry.score * 0.0008).toFixed(2)) : prev.distance
            }));
        }

        const historyData = await api.get<any>(`/users/${userId}/history`);
        setHistory(historyData);
      }
    } catch (e) {
      console.error('Failed to fetch data', e);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [stats.steps]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StepCounter 
        onDataUpdate={(data) => {
            if (data.currentSteps >= stats.steps) {
                setStats({ 
                    steps: data.currentSteps, 
                    calories: data.calories, 
                    distance: data.distance 
                });
            }
        }} 
      />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Progress & Rankings</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary}/>}
      >
        <View style={[
          styles.goalCard, 
          isGoalMet && { 
            borderColor: uiActiveColor, 
            backgroundColor: uiActiveColor + '15' 
          }
        ]}>
          <View style={styles.goalHeader}>
            <Text style={styles.goalTitle}>Daily Steps</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.goalPercent, { color: uiActiveColor }]}>
                {displayPercent}%
              </Text>
              {isGoalMet && <Ionicons name="checkmark-circle" size={18} color={uiActiveColor} style={{marginLeft: 4}} />}
            </View>
          </View>
          
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%`, backgroundColor: uiActiveColor }]} />
          </View>
          
          {/* FIX: Force text scaling to prevent truncation */}
          <View style={styles.goalStats}>
            <Text 
              numberOfLines={1} 
              adjustsFontSizeToFit 
              style={{ width: '100%' }}
            >
                <Text style={styles.currentSteps}>{stats.steps.toLocaleString()}</Text>
                <Text style={styles.totalGoal}> / {STEP_GOAL.toLocaleString()}</Text>
            </Text>
          </View>

          <VictoryChart data={history} color={chartActiveColor} />

        </View>

        <View style={styles.gridContainer}>
          <StatCard icon="flame" label="Calories" value={stats.calories} subValue="kcal" color="#EF4444" />
          <StatCard icon="map" label="Distance" value={stats.distance} subValue="km" color="#10B981" />
        </View>

        <StatCard 
          fullWidth icon="trophy" label="Current Rank" value={userRank} 
          subValue="Global Leaderboard" color="#F59E0B" 
        />

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