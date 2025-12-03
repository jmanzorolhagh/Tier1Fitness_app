import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  // --- GOAL CARD ---
  goalCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  goalPercent: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  progressBarBg: {
    height: 12,
    backgroundColor: '#0F172A',
    borderRadius: 6,
    marginBottom: 15,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 6,
  },
  goalStats: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currentSteps: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
  },
  totalGoal: {
    fontSize: 16,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  // --- GRID ---
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  // --- STAT CARDS ---
  statCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    width: '48%', 
    borderWidth: 1,
    borderColor: '#334155',
  },
  fullWidthCard: {
    width: '100%',
    marginBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statInfo: {
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
  },
  statSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  // --- LEADERBOARD ---
  sectionHeader: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  leaderboardCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  rankRowHighlight: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)', // Highlight "Me"
  },
  rankNumberContainer: {
    width: 30,
    alignItems: 'center',
    marginRight: 10,
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textSecondary,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#333',
    marginRight: 12,
  },
  rankUsername: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  rankScore: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
});