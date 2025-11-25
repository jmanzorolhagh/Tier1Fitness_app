import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LeaderboardEntry } from '@tier1fitness_app/types';
import styles from './LeaderboardScreenStyles';
import { colors } from '../theme/colors';
import api from '../services/api';

const LeaderboardHeader = () => (
  <View style={styles.headerContainer}>
    <Ionicons name="trophy" size={28} color={colors.primary} style={{ marginRight: 8 }} />
    <Text style={styles.headerTitle}>Leaderboard</Text>
  </View>
);

const LeaderboardItem = ({ item }: { item: LeaderboardEntry }) => {
  const getTrophyColor = (rank: number) => {
    switch (rank) {
      case 1: return colors.gold;
      case 2: return colors.silver;
      case 3: return colors.bronze;
      default: return null;
    }
  };

  return (
    <View style={styles.itemContainer}>
      <View style={styles.rankCircle}>
        <Text style={styles.rank}>{item.rank}</Text>
      </View>
      <Image source={{ uri: item.user.profilePicUrl }} style={styles.avatar} />
      <View style={styles.userInfo}>
        <Text style={styles.username}>{item.user.username}</Text>
      </View>
      <Text style={styles.score}>{item.score.toLocaleString()} steps</Text>
      {item.rank <= 3 && (
        <Ionicons
          name="trophy"
          size={20}
          color={getTrophyColor(item.rank)!}
          style={{ marginLeft: 8 }}
        />
      )}
    </View>
  );
};

export const LeaderboardScreen = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  const fetchLeaderboard = useCallback(async () => {
    if (!refreshing) {
      setLoading(true);
    }
    setError(null);

    try {
      const data: LeaderboardEntry[] = await api.get('/leaderboard');
      setLeaderboard(data);
    } catch (e: any) {
      setError(e.message || 'An error occurred');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [refreshing]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const renderContent = () => {
    if (loading && !refreshing) {
      return (
        <View style={styles.centerAll}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }
    if (error) {
      return (
        <View style={styles.centerAll}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }
    return (
      <FlatList
        data={leaderboard}
        renderItem={({ item }) => <LeaderboardItem item={item} />}
        keyExtractor={(item) => item.user.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => (
          <View style={styles.centerAll}>
            <Text style={styles.errorText}>
              No one has logged any steps today. Be the first!
            </Text>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    );
  };

  return (
    <View style={[
      styles.container,
      {
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }
    ]}>
      <LeaderboardHeader />
      {renderContent()}
    </View>
  );
};
