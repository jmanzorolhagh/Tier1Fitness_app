import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Challenge } from '@tier1fitness_app/types';
import { ChallengeCard } from '../components/ChallengeCard';
import { colors } from '../theme/colors';
import api from '../services/api';

export const ChallengeScreen = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  const fetchChallenges = useCallback(async () => {
    try {
      const data: Challenge[] = await api.get('/challenges');
      setChallenges(data);
    } catch (e) {
      console.error('Failed to fetch challenges', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchChallenges();
    }, [fetchChallenges])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchChallenges();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Active Challenges</Text>
        <Text style={styles.headerSubtitle}>Compete with the community! ⚔️</Text>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={challenges}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChallengeCard 
              challenge={item} 
              onJoinSuccess={onRefresh} // Refresh data to update count
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
              tintColor={colors.primary} 
            />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>No active challenges right now.</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  }
});