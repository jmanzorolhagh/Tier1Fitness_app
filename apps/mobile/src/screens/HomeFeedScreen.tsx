import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  RefreshControl,
  StyleSheet
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Post } from '@tier1fitness_app/types';
import { PostCard } from '../components/PostCard';
import { colors } from '../theme/colors';
import api from '../services/api';
import { Ionicons } from '@expo/vector-icons';
import { UserService } from '../services/userService'; // Import User Service

export const HomeFeedScreen = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const insets = useSafeAreaInsets();

  const fetchPosts = useCallback(async () => {
    // Only show full loading spinner on initial load, not during refresh
    if (!refreshing && posts.length === 0) {
      setLoading(true);
    }
    setError(null);

    try {
      // 1. Get Current User ID from local storage
      const user = await UserService.getUser();
      
      // 2. Add userId to the query string if logged in
      // This tells the server to check the 'Like' table for THIS specific user
      const endpoint = user ? `/posts?userId=${user.id}` : '/posts';
      
      const data: Post[] = await api.get(endpoint);
      setPosts(data);
    } catch (e: any) {
      setError(e.message || 'An error occurred');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [refreshing]);

  // useFocusEffect ensures data refreshes when you switch tabs 
  // or come back from Create Post / Login
  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [fetchPosts])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts();
  }, [fetchPosts]);

  const renderContent = () => {
    if (loading && !refreshing) {
      return (
        <View style={styles.centerAll}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading.....</Text>
        </View>
      );
    }

    if (error) {
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
        ListEmptyComponent={() => (
          <View style={styles.centerAll}>
            <Ionicons name="chatbubble-ellipses-outline" size={48} color={colors.textSecondary} />
            <Text style={styles.infoText}>No posts yet. Be the first to share!</Text>
          </View>
        )}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={colors.primary} 
          />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerAll: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: colors.textSecondary,
    marginTop: 10,
  },
  errorText: {
    color: colors.accent,
    textAlign: 'center',
    marginTop: 10,
  },
  infoText: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
  },
  listContainer: {
    paddingVertical: 10,
  }
});