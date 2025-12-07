import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ActivityIndicator, 
  Alert, 
  Dimensions, 
  FlatList, 
  TouchableOpacity,
  RefreshControl,
  Modal,
  TextInput
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/AppNavigator'; // Ensure correct import path
import { UserProfile, Post } from '@tier1fitness_app/types';
import api from '../services/api';
import { colors } from '../theme/colors';
import { PostCard } from '../components/PostCard'; 
import { UserService } from '../services/userService';

const { width } = Dimensions.get('window');
const POST_GRID_SIZE = (width - 6) / 3;

const defaultProfilePic = 'https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff';

export function ProfileScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  
  // If paramUserId is undefined, we assume it's "My Profile" tab
  const paramUserId = route.params?.userId;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'grid'>('posts');
  const [isFollowing, setIsFollowing] = useState(false); 
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Edit Mode State
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editBio, setEditBio] = useState('');
  const [editPic, setEditPic] = useState('');

  const loadData = useCallback(async () => {
    // Only show full loader if not refreshing
    if (!refreshing) setLoading(true);
    
    try {
      const user = await UserService.getUser();
      const myId = user?.id || null;
      setCurrentUserId(myId);

      // Determine target: paramUserId (external) or myId (internal)
      const targetId = paramUserId || myId;

      if (!targetId) {
        setLoading(false);
        setRefreshing(false);
        return; 
      }

      const endpoint = myId ? `/users/${targetId}?requesterId=${myId}` : `/users/${targetId}`;
      const data = await api.get<UserProfile>(endpoint);
      
      setProfile(data);
      setIsFollowing(data.isFollowing || false);

      // Pre-fill edit form if it's my profile
      if (data.id === myId) {
        setEditBio(data.bio || '');
        setEditPic(data.profilePicUrl || '');
      }

    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [paramUserId, refreshing]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleUpdateProfile = async () => {
    if (!currentUserId) return;

    try {
      // This calls the .put() method we just added to api.ts
      await api.put(`/users/${currentUserId}`, {
         bio: editBio,
         profilePicUrl: editPic
      });
      
      setEditModalVisible(false);
      onRefresh(); // Refresh the screen to show the new Bio/Pic
      Alert.alert("Success", "Profile updated!");
      
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to update profile.");
    }
  };
  const handleFollowToggle = async () => {
    if (!currentUserId || !profile) {
       Alert.alert('Login Required', 'You must be logged in to follow users.');
       return;
    }

    const newStatus = !isFollowing;
    setIsFollowing(newStatus);
    
    // Optimistic Update
    setProfile(prev => prev ? ({
      ...prev,
      followerCount: prev.followerCount + (newStatus ? 1 : -1)
    }) : null);

    try {
      await api.post('/users/follow', {
        followerId: currentUserId,
        followingId: profile.id
      });
    } catch (error) {
      console.error('Follow failed:', error);
      setIsFollowing(!newStatus); // Revert
      Alert.alert('Error', 'Failed to update follow status.');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Log Out", 
          style: 'destructive',
          onPress: async () => {
            await UserService.clearUser();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Splash' }],
            });
          }
        }
      ]
    );
  };

  const goToFollowers = () => {
    if (profile) navigation.push('Followers', { userId: profile.id, title: `${profile.username}'s Followers` });
  };

  const goToFollowing = () => {
    if (profile) navigation.push('Following', { userId: profile.id, title: `Following ${profile.username}` });
  };

  const renderHeader = () => {
    if (!profile) return null;
    const isOwnProfile = currentUserId === profile.id;

    return (
      <View style={styles.header}>
        <Image 
          source={{ uri: profile.profilePicUrl || defaultProfilePic }} 
          style={styles.profileImage}
        />
        <Text style={styles.username}>{profile.username}</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profile.posts.length}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <TouchableOpacity style={styles.statItem} onPress={goToFollowers}>
            <Text style={styles.statNumber}>{profile.followerCount}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statItem} onPress={goToFollowing}>
            <Text style={styles.statNumber}>{profile.followingCount}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </TouchableOpacity>
        </View>

        {profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}

        {isOwnProfile ? (
          <View style={{ alignItems: 'center', width: '100%' }}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.editButton]}
              onPress={() => setEditModalVisible(true)}
            >
                <Text style={[styles.actionButtonText, { color: colors.text }]}>Edit Profile</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                <Ionicons name="log-out-outline" size={20} color={colors.accent} style={{ marginRight: 8 }} />
                <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity 
            style={[styles.actionButton, isFollowing && styles.unfollowButton]}
            onPress={handleFollowToggle}
            disabled={!currentUserId}
          >
            <Text style={[styles.actionButtonText, isFollowing && { color: colors.text }]}>
              {isFollowing ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
        )}

        {profile.healthStats && (
          <View style={styles.healthStats}>
            <Text style={styles.healthTitle}>Daily Activity</Text>
            <View style={styles.healthRow}>
                <Ionicons name="footsteps" size={18} color={colors.primary} />
                <Text style={styles.healthText}>{profile.healthStats.dailySteps.toLocaleString()} Steps</Text>
            </View>
            <View style={styles.healthRow}>
                <Ionicons name="flame" size={18} color={colors.accent} />
                <Text style={styles.healthText}>{profile.healthStats.dailyCalories.toLocaleString()} Calories</Text>
            </View>
          </View>
        )}

        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
            onPress={() => setActiveTab('posts')}
          >
            <Ionicons name="list" size={24} color={activeTab === 'posts' ? colors.primary : colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'grid' && styles.activeTab]}
            onPress={() => setActiveTab('grid')}
          >
            <Ionicons name="grid" size={24} color={activeTab === 'grid' ? colors.primary : colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderPostItem = ({ item }: { item: Post }) => <PostCard post={item} />;
  
  const renderGridItem = ({ item }: { item: Post }) => (
    <View style={styles.gridItemContainer}>
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.gridImage} />
      ) : (
        <View style={[styles.gridImage, { justifyContent: 'center', alignItems: 'center', backgroundColor: colors.border }]}>
             <Text style={{color: colors.textSecondary, fontSize: 10}}>{item.postType}</Text>
        </View>
      )}
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!profile && !loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Profile not found. Please log in.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Edit Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            
            <Text style={styles.label}>Profile Picture URL</Text>
            <TextInput 
              style={styles.input} 
              value={editPic} 
              onChangeText={setEditPic}
              placeholder="https://..." 
              placeholderTextColor="#666"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Bio</Text>
            <TextInput 
              style={[styles.input, { height: 80, textAlignVertical: 'top' }]} 
              value={editBio} 
              onChangeText={setEditBio}
              multiline 
              placeholder="Tell us about yourself..."
              placeholderTextColor="#666"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setEditModalVisible(false)} style={styles.cancelButton}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleUpdateProfile} style={styles.saveButton}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Main List */}
      {activeTab === 'posts' ? (
        <FlatList
          data={profile?.posts || []}
          renderItem={renderPostItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        />
      ) : (
        <FlatList
          key={`flatlist-grid`}
          data={profile?.posts || []}
          renderItem={renderGridItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          numColumns={3}
          contentContainerStyle={styles.scrollContent}
          columnWrapperStyle={styles.gridColumnWrapper}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  errorText: { color: colors.text, fontSize: 16 },
  scrollContent: { paddingBottom: 20 },
  header: { paddingTop: 10, alignItems: 'center', backgroundColor: colors.background, marginBottom: 10 },
  profileImage: { width: 90, height: 90, borderRadius: 45, marginBottom: 12, borderWidth: 2, borderColor: colors.primary, backgroundColor: '#333' },
  username: { fontSize: 22, fontWeight: 'bold', color: colors.text, marginBottom: 12 },
  bio: { color: colors.textSecondary, textAlign: 'center', marginBottom: 15, paddingHorizontal: 30 },
  statsContainer: { flexDirection: 'row', width: '100%', justifyContent: 'space-around', marginBottom: 20, paddingVertical: 10, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border },
  statItem: { alignItems: 'center', paddingHorizontal: 0 },
  statNumber: { fontSize: 18, fontWeight: 'bold', color: colors.text },
  statLabel: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  actionButton: { backgroundColor: colors.primary, paddingVertical: 10, paddingHorizontal: 40, borderRadius: 20, marginBottom: 10, minWidth: 150, alignItems: 'center' },
  editButton: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  unfollowButton: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.textSecondary },
  actionButtonText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', padding: 10, marginBottom: 10 },
  logoutText: { color: colors.accent, fontSize: 16, fontWeight: '600' },
  healthStats: { width: '90%', flexDirection: 'row', justifyContent: 'space-around', padding: 12, borderRadius: 12, backgroundColor: colors.surface, marginBottom: 10 },
  healthTitle: { position: 'absolute', top: -10, left: 10, fontSize: 10, fontWeight: 'bold', color: colors.textSecondary, backgroundColor: colors.background, paddingHorizontal: 4 },
  healthRow: { flexDirection: 'row', alignItems: 'center' },
  healthText: { marginLeft: 6, color: colors.text, fontSize: 13, fontWeight: '600' },
  tabContainer: { flexDirection: 'row', width: '100%', marginTop: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: colors.primary },
  gridColumnWrapper: { gap: 2 },
  gridItemContainer: { width: POST_GRID_SIZE, height: POST_GRID_SIZE, backgroundColor: colors.surface, marginBottom: 2 },
  gridImage: { width: '100%', height: '100%' },
  
  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: colors.surface, padding: 20, borderRadius: 16, borderWidth: 1, borderColor: colors.border },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text, marginBottom: 20, textAlign: 'center' },
  label: { color: colors.textSecondary, marginBottom: 8, fontSize: 14 },
  input: { backgroundColor: colors.background, color: colors.text, padding: 12, borderRadius: 8, marginBottom: 16, borderWidth: 1, borderColor: colors.border },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  cancelButton: { padding: 12 },
  cancelText: { color: colors.textSecondary, fontWeight: '600' },
  saveButton: { backgroundColor: colors.primary, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  saveText: { color: 'white', fontWeight: 'bold' }
});