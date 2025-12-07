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

type CreateScreenProp = NativeStackNavigationProp<RootStackParamList, 'CreatePost'>;

// Enhanced Options with Icons
const POST_TYPES = [
  { label: "Workout", value: PostType.WORKOUT, icon: "barbell" },
  { label: "Progress", value: PostType.PROGRESS_PHOTO, icon: "camera" },
  { label: "Milestone", value: PostType.MILESTONE, icon: "trophy" },
  { label: "Motivation", value: PostType.MOTIVATION, icon: "flame" },
];

const CHALLENGE_DURATIONS = [
  { label: "3 Days", days: 3 },
  { label: "1 Week", days: 7 },
  { label: "2 Weeks", days: 14 },
  { label: "30 Days", days: 30 },
];

export function CreatePostScreen() {
  const [mode, setMode] = useState<'POST' | 'CHALLENGE'>('POST');
  const [loading, setLoading] = useState(false);
  
  // Post State
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [postType, setPostType] = useState<PostType>(PostType.WORKOUT);

  // Challenge State
  const [challengeTitle, setChallengeTitle] = useState('');
  const [challengeDesc, setChallengeDesc] = useState('');
  const [duration, setDuration] = useState(7); 
  const [targetMetric, setTargetMetric] = useState<'STEPS' | 'CALORIES'>('STEPS');
  const [targetValue, setTargetValue] = useState('');

  const navigation = useNavigation<CreateScreenProp>();
  const insets = useSafeAreaInsets();

  const handleCreate = async () => {
    const user = await UserService.getUser();
    if (!user) {
      Alert.alert("Login Required", "Please log in to create content.");
      return;
    }

    setLoading(true);
    try {
      if (mode === 'POST') {
        if (!caption) throw new Error("Please enter a caption.");
        
        await api.post('/posts', {
          caption,
          imageUrl: imageUrl || null,
          postType,
          userId: user.id,
        });
        
        Alert.alert("Success", "Post created!");
        setCaption('');
        setImageUrl('');
        navigation.navigate('HomeFeed');

      } else {
        if (!challengeTitle) throw new Error("Please enter a challenge title.");
        if (!challengeDesc) throw new Error("Please enter a description.");
        if (!targetValue) throw new Error("Please enter a target goal value.");

        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + duration);

        await api.post('/challenges', {
          title: challengeTitle,
          description: challengeDesc,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          creatorId: user.id,
          goalType: targetMetric,
          goalValue: parseInt(targetValue, 10),
        });

        // Auto-Post to Feed
        await api.post('/posts', {
          caption: `I just launched a new challenge: "${challengeTitle}"! ⚔️\n\nGoal: ${parseInt(targetValue).toLocaleString()} ${targetMetric.toLowerCase()} in ${duration} days.\n\nGo to the Challenges tab to join me!`,
          postType: 'CHALLENGE_UPDATE',
          userId: user.id,
        });

        Alert.alert("Success", "Challenge launched and posted to feed! 🚀");
        
        setChallengeTitle('');
        setChallengeDesc('');
        setTargetValue('');
        navigation.navigate('Challenges');
      }

    } catch (e: any) {
      Alert.alert('Creation Failed', e.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 20, paddingTop: insets.top + 10 }
        ]}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.header}>Create New</Text>
        </View>

        {/* Mode Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[styles.toggleItem, mode === 'POST' && styles.toggleItemActive]} 
            onPress={() => setMode('POST')}
            activeOpacity={0.8}
          >
            <Text style={[styles.toggleText, mode === 'POST' && styles.toggleTextActive]}>Post</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleItem, mode === 'CHALLENGE' && styles.toggleItemActive]} 
            onPress={() => setMode('CHALLENGE')}
            activeOpacity={0.8}
          >
            <Text style={[styles.toggleText, mode === 'CHALLENGE' && styles.toggleTextActive]}>Challenge</Text>
          </TouchableOpacity>
        </View>

        {mode === 'POST' ? (
          <>
            <Text style={styles.label}>Select Category</Text>
            <View style={styles.tabRow}>
              {POST_TYPES.map(type => (
                <TouchableOpacity
                  key={type.value}
                  onPress={() => setPostType(type.value)}
                  style={[styles.tab, postType === type.value && styles.tabSelected]}
                >
                  <Ionicons 
                    name={type.icon as any} 
                    size={16} 
                    color={postType === type.value ? colors.primary : colors.textSecondary} 
                    style={{ marginRight: 6 }}
                  />
                  <Text style={postType === type.value ? styles.tabTextSelected : styles.tabText}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Caption</Text>
            <TextInput
              style={[styles.input, { height: 120, textAlignVertical: 'top' }]}
              placeholder="What did you achieve today?"
              placeholderTextColor={colors.textSecondary}
              value={caption}
              onChangeText={setCaption}
              multiline
            />

            <Text style={styles.label}>Image URL (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="https://..."
              placeholderTextColor={colors.textSecondary}
              value={imageUrl}
              onChangeText={setImageUrl}
              autoCapitalize="none"
            />
          </>
        ) : (
          <>
            <Text style={styles.label}>Challenge Title</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 30k Steps Weekend"
              placeholderTextColor={colors.textSecondary}
              value={challengeTitle}
              onChangeText={setChallengeTitle}
            />

            <Text style={styles.label}>Goal / Description</Text>
            <TextInput
              style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
              placeholder="Explain the rules..."
              placeholderTextColor={colors.textSecondary}
              value={challengeDesc}
              onChangeText={setChallengeDesc}
              multiline
            />

            <Text style={styles.label}>Metric to Track</Text>
            <View style={styles.tabRow}>
              {['STEPS', 'CALORIES'].map((metric) => (
                <TouchableOpacity
                  key={metric}
                  onPress={() => setTargetMetric(metric as 'STEPS' | 'CALORIES')}
                  style={[styles.tab, targetMetric === metric && styles.tabSelected]}
                >
                  <Ionicons 
                    name={metric === 'STEPS' ? 'footsteps' : 'flame'} 
                    size={16} 
                    color={targetMetric === metric ? colors.primary : colors.textSecondary} 
                    style={{ marginRight: 6 }}
                  />
                  <Text style={targetMetric === metric ? styles.tabTextSelected : styles.tabText}>
                    {metric === 'STEPS' ? 'Steps' : 'Calories'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Target Amount</Text>
            <TextInput
              style={styles.input}
              placeholder={targetMetric === 'STEPS' ? "e.g., 50000" : "e.g., 3000"}
              placeholderTextColor={colors.textSecondary}
              value={targetValue}
              onChangeText={setTargetValue}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Duration</Text>
            <View style={styles.durationRow}>
              {CHALLENGE_DURATIONS.map(item => (
                <TouchableOpacity
                  key={item.days}
                  style={[styles.durationBtn, duration === item.days && styles.durationBtnSelected]}
                  onPress={() => setDuration(item.days)}
                >
                  <Text style={[styles.durationText, duration === item.days && styles.durationTextSelected]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleCreate}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.shareButtonText}>
              {mode === 'POST' ? 'Share Post' : 'Launch Challenge'}
            </Text>
          )}
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}