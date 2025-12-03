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
  headerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
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
    marginBottom: 20,
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
  // --- TIP CARD ---
  tipCard: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)', // Very faint blue
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  tipText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#93C5FD',
    lineHeight: 20,
    flex: 1,
  },
});