import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import styles from './CreatePostScreenStyles';
import { PostType } from '@tier1fitness_app/types';
import { RootStackParamList } from '../navigation/AppNavigator';
import { colors } from '../theme/colors';
import api from '../services/api';
import { UserService } from '../services/userService';
import { Ionicons } from '@expo/vector-icons';

type CreatePostNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreatePost'>;

const POST_TYPES: { label: string, value: PostType }[] = [
  { label: "Workout", value: PostType.WORKOUT },
  { label: "Progress", value: PostType.PROGRESS_PHOTO },
  { label: "Milestone", value: PostType.MILESTONE },
  { label: "Motivation", value: PostType.MOTIVATION },
  { label: "Challenge", value: PostType.CHALLENGE_UPDATE },
];

export function CreatePostScreen() {
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [postType, setPostType] = useState<PostType>(PostType.WORKOUT);
  const [loading, setLoading] = useState(false);
  
  const navigation = useNavigation<CreatePostNavigationProp>();
  const insets = useSafeAreaInsets();

  const handleSubmit = async () => {
    if (!caption) {
      Alert.alert('Error', 'Please enter a description for your post.');
      return;
    }

    // 1. Get the real logged-in user from storage
    const currentUser = await UserService.getUser();

    if (!currentUser) {
      Alert.alert("Not Logged In", "Please log in to create a post.");
      return;
    }

    setLoading(true);

    try {
      await api.post('/posts', {
        caption,
        imageUrl: imageUrl || null,
        postType,
        userId: currentUser.id, // <--- Dynamic ID
      });
      
      // 2. Clear fields
      setCaption('');
      setImageUrl('');
      
      // 3. Navigate back to HomeFeed
      navigation.navigate('HomeFeed');
      
    } catch (e: any) {
      Alert.alert('Post Failed', e.message);
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          {
            paddingBottom: insets.bottom + 20,
            paddingLeft: insets.left + 16,
            paddingRight: insets.right + 16,
          }
        ]}
      >
        <View style={styles.headerRow}>
          <Ionicons name="create-outline" size={26} color={colors.primary} style={{ marginRight: 8 }} />
          <Text style={styles.header}>Create a Post</Text>
        </View>

        <Text style={styles.label}>What would you like to share?</Text>
        <View style={styles.tabRow}>
          {POST_TYPES.map(type => (
            <TouchableOpacity
              key={type.value}
              onPress={() => setPostType(type.value)}
              style={[styles.tab, postType === type.value && styles.tabSelected]}
            >
              <Text style={postType === type.value ? styles.tabTextSelected : styles.tabText}>
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          placeholder="Share your workouts or progress!"
          placeholderTextColor={colors.textSecondary} // <--- Makes placeholder visible
          value={caption}
          onChangeText={setCaption}
          multiline
        />

        <Text style={styles.label}>Image URL (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Paste image URL here"
          placeholderTextColor={colors.textSecondary} // <--- Makes placeholder visible
          value={imageUrl}
          onChangeText={setImageUrl}
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.shareButtonText}>Share Post</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}