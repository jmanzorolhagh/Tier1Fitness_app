import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/AppNavigator';
import { PublicUser } from '@tier1fitness_app/types';
import api from '../services/api';
import { colors } from '../theme/colors';

type ListScreenRouteProp = RouteProp<RootStackParamList, 'Followers' | 'Following'>;

const defaultProfilePic = 'https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff';

export const FollowersScreen = () => {
  const route = useRoute<ListScreenRouteProp>();
  const navigation = useNavigation<any>();
  const { userId } = route.params; 
  
  const [userList, setUserList] = useState<PublicUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [userId]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = route.name === 'Followers' 
        ? `/users/${userId}/followers`
        : `/users/${userId}/following`;
      
      const data: PublicUser[] = await api.get(endpoint);
      setUserList(data);
    } catch (e) {
      setError("Failed to load user list.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: PublicUser }) => (
    <TouchableOpacity 
      style={styles.listItem}
      onPress={() => {
        navigation.push('Profile', { userId: item.id }); // Use push to handle navigation stack correctly
      }}
    >
      <Image 
        source={{ uri: item.profilePicUrl || defaultProfilePic }} 
        style={styles.profileImage}
      />
      <Text style={styles.username}>{item.username}</Text>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="large" color={colors.primary} style={styles.center} />;
    }
    if (error) {
      return <Text style={[styles.center, styles.errorText]}>{error}</Text>;
    }
    if (userList.length === 0) {
      const message = route.name === 'Followers' 
        ? 'No followers yet. Time to post more!'
        : 'Not following anyone yet. Find some inspiring people!';
      return (
        <View style={styles.center}>
          <Ionicons name="people-outline" size={40} color={colors.textSecondary} />
          <Text style={styles.emptyText}>{message}</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={userList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    );
  };

  return (
    <View style={styles.container}>
      {renderContent()}
    </View>
  );
};

export const FollowingScreen = FollowersScreen; 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listContainer: {
    paddingVertical: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: colors.surface,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  username: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 75,
  },
  errorText: {
    color: colors.accent,
    fontSize: 16,
  },
  emptyText: {
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: 14,
    marginTop: 10,
  }
});