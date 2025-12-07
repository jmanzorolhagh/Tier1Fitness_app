import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  Image, 
  Alert, 
  TouchableOpacity,
  Share // <--- Imported for native sharing
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
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

  const handleInvite = async () => {
  if (!challengeData) return;
  
  const goalLabel = challengeData.goalType === 'STEPS' ? 'Steps' : 'Calories';
  const goalNum = challengeData.goalValue.toLocaleString();

  const appLink = "https://github.com/jmanzorolhagh/Tier1Fitness_app"; 

  try {
    await Share.share({
      message: `Come join my team challenge "${challengeData.title}" on Tier1Fitness! ⚔️\n\nTeam Goal: ${goalNum} ${goalLabel}.\n\nDownload the app here: ${appLink}`,
      url: appLink, 
    });
  } catch (error: any) {
  }
};

  if (loading || !challengeData) {
    return <View style={styles.center}><ActivityIndicator color={colors.primary} /></View>;
  }

  // --- Logic & Display Vars ---
  const isSteps = challengeData.goalType === 'STEPS';
  const goalValue = challengeData.goalValue;
  const currentTotal = isSteps ? challengeData.groupProgress.steps : challengeData.groupProgress.calories;
  const percentage = Math.round((currentTotal / goalValue) * 100);
  const themeColor = isSteps ? colors.primary : colors.accent;

  const renderParticipant = ({ item, index }: { item: any, index: number }) => {
    const score = isSteps ? item.totalSteps : item.totalCalories;

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
          <Text style={styles.username} numberOfLines={1} adjustsFontSizeToFit>
            {item.username}
          </Text>
          <Text style={styles.contributionLabel}>Contribution</Text>
        </View>
        <Text style={[styles.score, { color: themeColor }]}>
          {score.toLocaleString()} {isSteps ? 'steps' : 'kcal'}
        </Text>
        <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} style={{ marginLeft: 4 }} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={challengeData.participants}
        renderItem={renderParticipant}
        keyExtractor={item => item.userId}
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <Text style={styles.title}>{challengeData.title}</Text>
            <Text style={styles.description}>{challengeData.description}</Text>
            
            <View style={styles.groupStatsCard}>
              <Text style={styles.groupLabel}>TEAM PROGRESS</Text>
              
              {/* Fixed Layout: Single Text block prevents truncation/overlap */}
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

              {/* Invite Button inside the card */}
              <TouchableOpacity style={[styles.inviteButton, { borderColor: themeColor + '40' }]} onPress={handleInvite}>
                 <Ionicons name="person-add" size={18} color={themeColor} style={{ marginRight: 8 }} />
                 <Text style={[styles.inviteText, { color: themeColor }]}>Invite Friends</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionHeader}>Participants ({challengeData.participants.length})</Text>
          </View>
        )}
      />
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
    marginBottom: 10,
  },
  groupLabel: { color: colors.textSecondary, fontSize: 12, fontWeight: 'bold', marginBottom: 10, letterSpacing: 1 },
  bigNumber: { fontSize: 32, fontWeight: '900' },
  goalNumber: { fontSize: 18, color: colors.textSecondary },
  percentText: { textAlign: 'right', color: colors.textSecondary, marginTop: 8, fontSize: 12 },
  
  // Progress Bar
  progressContainer: { height: 12, backgroundColor: '#0F172A', borderRadius: 6, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 6 },

  // Invite Button
  inviteButton: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: colors.background, // Slightly distinctive background
    borderRadius: 12,
    borderWidth: 1,
  },
  inviteText: {
    fontWeight: '700',
    fontSize: 14,
  },

  // List Items
  sectionHeader: { color: colors.text, fontSize: 18, fontWeight: 'bold', marginBottom: 15, marginTop: 20 },
  row: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: colors.surface, 
    padding: 12, 
    marginHorizontal: 20, // Since it's inside FlatList now, we add margin here
    borderRadius: 12, 
    marginBottom: 10 
  },
  rank: { color: colors.textSecondary, fontWeight: 'bold', width: 30, fontSize: 16 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12, backgroundColor: '#333' },
  username: { color: colors.text, fontWeight: '600', fontSize: 15 },
  contributionLabel: { color: colors.textSecondary, fontSize: 10 },
  score: { fontWeight: 'bold', fontSize: 15 },
});