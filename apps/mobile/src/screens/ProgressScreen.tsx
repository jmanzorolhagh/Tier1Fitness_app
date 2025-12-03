import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import styles from './ProgressScreenStyles';
import { colors } from '../theme/colors';
import { StepCounter } from '../components/StepCounter';
import { UserService } from '../services/userService';
import api from '../services/api';
import { LeaderboardEntry } from '@tier1fitness_app/types';

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

export const ProgressScreen = () => {
  const insets = useSafeAreaInsets();
  const [stats, setStats] = useState({ steps: 0, calories: 0, distance: 0 });
  const [userRank, setUserRank] = useState<string>('-'); 
  const [refreshing, setRefreshing] = useState(false);

  const STEP_GOAL = 10000;
  const progressPercent = Math.min(stats.steps / STEP_GOAL, 1) * 100;

  const fetchRank = async () => {
    const user = await UserService.getUser();
    if (!user) return;

    try {
      const data: LeaderboardEntry[] = await api.get('/leaderboard');
      
      const myEntry = data.find(entry => entry.user.id === user.id);
      
      if (myEntry) {
        setUserRank(`#${myEntry.rank}`);
      } else {
        setUserRank('> 10'); 
      }
    } catch (e) {
      console.error('Failed to fetch rank');
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchRank();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchRank();
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StepCounter 
        onDataUpdate={(data) => setStats({ 
          steps: data.currentSteps, 
          calories: data.calories, 
          distance: data.distance 
        })} 
      />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Progress</Text>
        <Text style={styles.headerSubtitle}>Keep pushing forward! 🔥</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary}/>}
      >
        {/* --- MAIN GOAL CARD --- */}
        <View style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <Text style={styles.goalTitle}>Daily Step Goal</Text>
            <Text style={styles.goalPercent}>{Math.round(progressPercent)}%</Text>
          </View>
          
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
          
          <View style={styles.goalStats}>
            <Text style={styles.currentSteps}>{stats.steps.toLocaleString()}</Text>
            <Text style={styles.totalGoal}>/ {STEP_GOAL.toLocaleString()} steps</Text>
          </View>
        </View>

        <View style={styles.gridContainer}>
          <StatCard 
            icon="flame" 
            label="Calories" 
            value={stats.calories} 
            subValue="kcal burned"
            color="#EF4444" 
          />
          <StatCard 
            icon="map" 
            label="Distance" 
            value={stats.distance} 
            subValue="km walked"
            color="#10B981" 
          />
        </View>

        <StatCard 
          fullWidth 
          icon="trophy" 
          label="Current Rank" 
          value={userRank} 
          subValue={userRank === '> 10' ? "Keep stepping to reach Top 10!" : "You are in the Top 10!"}
          color="#F59E0B" 
        />

        <View style={styles.tipCard}>
          <MaterialCommunityIcons name="lightbulb-on-outline" size={24} color={colors.primary} />
          <Text style={styles.tipText}>
            Walking just 30 minutes a day can improve cardiovascular fitness and reduce excess body fat.
          </Text>
        </View>

      </ScrollView>
    </View>
  );
};