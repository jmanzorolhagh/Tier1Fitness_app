import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ActivityIndicator, 
  Alert, 
  Dimensions, 
  FlatList, 
  TouchableOpacity 
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/AppNavigator';
import { UserProfile, Post } from '@tier1fitness_app/types';
import api from '../services/api';
import { colors } from '../theme/colors';
import { PostCard } from '../components/PostCard'; 
import { UserService } from '../services/userService';
import { MY_DEMO_USER_ID } from '../services/api';

import AsyncStorage from '@react-native-async-storage/async-storage';





// Define route props
type ProfileRouteProp = RouteProp<RootStackParamList, 'Profile'>;
type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const { width } = Dimensions.get('window');
const POST_GRID_SIZE = (width - 6) / 3; // 3 columns with tiny margin

const defaultProfilePic = 'https://i.pravatar.cc/300?img=5';

export function ProfileScreen() {
  const route = useRoute<ProfileRouteProp>();
  const navigation = useNavigation<Props>();
  const { userId } = route.params;
  const { params } = useRoute<ProfileRouteProp>();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'grid'>('posts');
  const [isFollowing, setIsFollowing] = useState(false); 
  const isOwnProfile = userId === MY_DEMO_USER_ID;

  const [posts, setPosts] = useState<Post[] | null>(null);
  useEffect(() => {
      fetchPosts();
    }, []);
    const fetchPosts = async () => {
      try {
        const data = await api.get(`/users/${userId}/posts`);
        setPosts(data); // can be [] or filled array
      } catch (error) {
        console.log("Failed to load user posts:", error);
      }
    };

    
  
  const handleLogout = async () => {
  try {
    // remove any stored user ID or token
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('token');

    // Reset navigation back to Login screen
    navigation.reset({
  index: 0,
  routes: [{ name: "Splash" }],
});

  } catch (error) {
    console.log("Logout failed:", error);
  }
};

  

  const fetchProfile = async () => {
    setLoading(true);
    try {
      // GET /api/users/:id
      const data = await api.get<UserProfile>(`/users/${userId}`);
      setProfile(data);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      Alert.alert('Error', 'Could not load profile data.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const handleFollowToggle = () => {
    // Mock logic for UI feedback
    setIsFollowing(prev => !prev);
    if (profile) {
      setProfile(prev => prev ? ({
        ...prev,
        followerCount: prev.followerCount + (isFollowing ? -1 : 1)
      }) : null);
    }
  };

  // --- HEADER COMPONENT ---
  const renderHeader = () => {
    if (!profile) return null;
    if (posts === null) return <Loading />;


    return (
      <View style={styles.header}>
        <Image 
          source={{ uri: profile.profilePicUrl || defaultProfilePic }} 
          style={styles.profileImage}
        />
        <Text style={styles.username}>{profile.username}</Text>
        
        {/* Stats Row */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profile.posts.length}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profile.followerCount}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profile.followingCount}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>

        {profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}

        {/* Follow Button */}
        <TouchableOpacity 
          style={[styles.actionButton, isFollowing && styles.unfollowButton]}
          onPress={handleFollowToggle}
        >
          <Text style={styles.actionButtonText}>
            {isFollowing ? 'Following' : 'Follow'}
          </Text>
        </TouchableOpacity>

        {/* Health Data Summary */}
        <View style={styles.healthStats}>
            <Text style={styles.healthTitle}>Today's Activity</Text>
            <View style={styles.healthRow}>
                <Ionicons name="footsteps" size={18} color={colors.primary} />
                <Text style={styles.healthText}>
                    {profile.healthStats.dailySteps.toLocaleString()} Steps
                </Text>
            </View>
            <View style={styles.healthRow}>
                <Ionicons name="flame" size={18} color={colors.accent} />
                <Text style={styles.healthText}>
                    {profile.healthStats.dailyCalories.toLocaleString()} Calories
                </Text>
            </View>
        </View>

        {/* View Toggle Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
            onPress={() => setActiveTab('posts')}
          >
            <Ionicons 
                name="list" 
                size={24} 
                color={activeTab === 'posts' ? colors.primary : colors.textSecondary} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'grid' && styles.activeTab]}
            onPress={() => setActiveTab('grid')}
          >
            <Ionicons 
                name="grid" 
                size={24} 
                color={activeTab === 'grid' ? colors.primary : colors.textSecondary} 
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // --- RENDER ITEMS ---
  const renderPostItem = ({ item }: { item: Post }) => (
    <PostCard post={item} />
  );

  const renderGridItem = ({ item }: { item: Post }) => {
    // If no image, maybe show a placeholder or text preview?
    // For now we just use a default gray box if no image
    return (
      <View style={styles.gridItemContainer}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.gridImage} />
        ) : (
          <View style={[styles.gridImage, { justifyContent: 'center', alignItems: 'center' }]}>
             <Text style={{color: colors.textSecondary, fontSize: 10}}>{item.postType}</Text>
          </View>
        )}
        
        {/* Overlay Likes count */}
        <View style={styles.gridOverlay}>
          <Ionicons name="heart" size={12} color="white" />
          <Text style={styles.gridStatText}>{item.likeCount}</Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Profile not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {activeTab === 'posts' ? (
        <FlatList
          data={posts || []}
          renderItem={renderGridItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          numColumns={3}
          contentContainerStyle={styles.scrollContent}
          columnWrapperStyle={styles.gridColumnWrapper}
          showsVerticalScrollIndicator={false}
        />

      ) : (
        <FlatList
          data={posts || []}   // using only user’s posts
          renderItem={renderPostItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        />

      )}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorText: {
    color: colors.text,
    fontSize: 16,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    paddingTop: 10,
    alignItems: 'center',
    backgroundColor: colors.background,
    marginBottom: 10,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  bio: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 15,
    paddingHorizontal: 30,
  },
  statsContainer: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  actionButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginBottom: 20,
  },
  unfollowButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.textSecondary,
  },
  actionButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  healthStats: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    borderRadius: 12,
    backgroundColor: colors.surface,
    margin: 10,
  },
  healthTitle: {
    position: 'absolute',
    top: -10,
    left: 10,
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.textSecondary,
    backgroundColor: colors.background,
    paddingHorizontal: 10,
    padding: 4
  },
  healthRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  healthText: {
    marginLeft: 6,
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  gridColumnWrapper: {
    gap: 2,
  },
  gridItemContainer: {
    width: POST_GRID_SIZE,
    height: POST_GRID_SIZE,
    backgroundColor: colors.surface,
    marginBottom: 2,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridOverlay: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  gridStatText: {
    color: 'white',
    fontSize: 10,
    marginLeft: 3,
    fontWeight: 'bold',
  },
  logoutButton: {
  marginTop: 20,
  backgroundColor: "#ff3b30",
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 10,
  alignItems: "center",
},

logoutText: {
  color: "white",
  fontSize: 16,
  fontWeight: "600",
}
});