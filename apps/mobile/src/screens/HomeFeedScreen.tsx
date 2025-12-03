import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native'; // <--- IMPORT THIS
import { Post } from '@tier1fitness_app/types';
import { PostCard } from '../components/PostCard';
import { StepCounter } from '../components/StepCounter';
import { colors } from '../theme/colors';
import styles from './HomeFeedScreenStyles';
import api from '../services/api';
import { Ionicons } from '@expo/vector-icons';

export const HomeFeedScreen = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const insets = useSafeAreaInsets();

  const fetchPosts = useCallback(async () => {
    setError(null);
    try {
      const data: Post[] = await api.get('/posts');
      setPosts(data);
    } catch (e: any) {
      console.error("Fetch error:", e);
      setError(e.message || 'An error occurred');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (posts.length === 0) {
        setLoading(true);
      }
      fetchPosts();
    }, [fetchPosts]) // removed posts.length dependency to avoid infinite loops, relying on navigation focus
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts();
  }, [fetchPosts]);

  const renderContent = () => {
    if (loading && !refreshing && posts.length === 0) {
      return (
        <View style={styles.centerAll}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading your feed    ...</Text>
        </View>
      );
    }

    if (error && posts.length === 0) {
      return (
        <View style={styles.centerAll}>
          <Ionicons name="alert-circle" size={28} color={colors.accent} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={posts}
        renderItem={({ item }) => <PostCard post={item} />}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<StepCounter />}
        ListEmptyComponent={() => (
          <View style={styles.centerAll}>
            <Ionicons name="chatbubble-ellipses-outline" size={28} color={colors.textSecondary} />
            <Text style={styles.infoText}>No posts yet. Be the first to share!</Text>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
      />
    );
  };

  return (
    <View style={[
      styles.container,
      {
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }
    ]}>
      {renderContent()}
    </View>
  );
};