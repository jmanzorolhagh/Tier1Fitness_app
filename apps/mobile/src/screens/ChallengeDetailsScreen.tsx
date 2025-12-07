import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  Image, 
  Alert, 
  TouchableOpacity 
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import api from '../services/api';
import { RootStackParamList } from '../navigation/AppNavigator';

const ProgressBar = ({ current, target, color }: { current: number, target: number, color: string }) => {
  const percent = Math.min((current / target) * 100, 100);
  return (
    <View style={styles.progressContainer}>
      <View style={[styles.progressFill, { width: `${percent}%`, backgroundColor: color }]} />
    </View>
  );
};

export const ChallengeDetailsScreen = () => {
  const route = useRoute<any>();
  // Use specific type to ensure .push() is available
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { challengeId } = route.params;

  const [challengeData, setChallengeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetails();
  }, [challengeId]);

  const fetchDetails = async () => {
    try {
      const data = await api.get<any>(`/challenges/${challengeId}`);
      setChallengeData(data);
    } catch (e) {
      Alert.alert("Error", "Could not load challenge details");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  if (loading || !challengeData) {
    return <View style={styles.center}><ActivityIndicator color={colors.primary} /></View>;
  }

  // --- Collaborative Logic ---
  const isSteps = challengeData.goalType === 'STEPS';
  const goalValue = challengeData.goalValue;
  const currentTotal = isSteps ? challengeData.groupProgress.steps : challengeData.groupProgress.calories;
  const percentage = Math.round((currentTotal / goalValue) * 100);
  const themeColor = isSteps ? colors.primary : colors.accent;

  const renderParticipant = ({ item, index }: { item: any, index: number }) => {
    const score = isSteps ? item.totalSteps : item.totalCalories;

    // --- NEW: Navigation Logic ---
    const goToProfile = () => {
      navigation.push('Profile', { userId: item.userId });
    };

    return (
      <TouchableOpacity 
        style={styles.row} 
        onPress={goToProfile}
        activeOpacity={0.7}
      >
        <Text style={styles.rank}>#{index + 1}</Text>
        <Image source={{ uri: item.profilePicUrl }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.username}>{item.username}</Text>
          <Text style={styles.contributionLabel}>Contribution</Text>
        </View>
        <Text style={[styles.score, { color: themeColor }]}>
          {score.toLocaleString()} {isSteps ? 'steps' : 'kcal'}
        </Text>
        {/* Little chevron to hint interactivity */}
        <View style={{ marginLeft: 8 }}>
            {/* You can import Ionicons here if you want a visual cue, 
                but the touch opacity is usually enough */}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>{challengeData.title}</Text>
        <Text style={styles.description}>{challengeData.description}</Text>
        
        <View style={styles.groupStatsCard}>
          <Text style={styles.groupLabel}>TEAM PROGRESS</Text>
          <Text style={{ marginBottom: 8 }}>
          <Text style={[styles.bigNumber, { color: themeColor }]}>
            {currentTotal.toLocaleString()} 
          </Text>
          <Text style={styles.goalNumber}>
            {' '}/ {goalValue.toLocaleString()}
          </Text>
        </Text>
          
          <ProgressBar current={currentTotal} target={goalValue} color={themeColor} />
          
          <Text style={styles.percentText}>{percentage}% Completed</Text>
        </View>
      </View>

      {/* Participants List */}
      <View style={styles.listContainer}>
        <Text style={styles.sectionHeader}>Participants ({challengeData.participants.length})</Text>
        <FlatList
          data={challengeData.participants}
          renderItem={renderParticipant}
          keyExtractor={item => item.userId}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  header: { padding: 20, paddingBottom: 10 },
  title: { fontSize: 24, fontWeight: '800', color: colors.text, marginBottom: 8 },
  description: { color: colors.textSecondary, marginBottom: 20, fontSize: 14, lineHeight: 20 },
  
  // Group Card
  groupStatsCard: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  groupLabel: { color: colors.textSecondary, fontSize: 12, fontWeight: 'bold', marginBottom: 10, letterSpacing: 1 },
  bigNumber: { fontSize: 32, fontWeight: '900' },
  goalNumber: { fontSize: 18, color: colors.textSecondary, marginBottom: 4 },
  percentText: { textAlign: 'right', color: colors.textSecondary, marginTop: 8, fontSize: 12 },
  
  // Progress Bar
  progressContainer: { height: 12, backgroundColor: '#0F172A', borderRadius: 6, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 6 },

  // List
  listContainer: { flex: 1, paddingHorizontal: 20 },
  sectionHeader: { color: colors.text, fontSize: 18, fontWeight: 'bold', marginBottom: 15, marginTop: 10 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, padding: 12, borderRadius: 12, marginBottom: 10 },
  rank: { color: colors.textSecondary, fontWeight: 'bold', width: 30, fontSize: 16 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12, backgroundColor: '#333' },
  username: { color: colors.text, fontWeight: '600', fontSize: 15 },
  contributionLabel: { color: colors.textSecondary, fontSize: 10 },
  score: { fontWeight: 'bold', fontSize: 15 },
});