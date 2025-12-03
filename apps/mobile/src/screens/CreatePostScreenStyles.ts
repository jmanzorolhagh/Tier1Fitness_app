import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  // --- NEW: MODE TOGGLE ---
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  toggleItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  toggleItemActive: {
    backgroundColor: colors.primary,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  toggleTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  // ------------------------
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 10,
    marginTop: 10,
  },
  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  // Post Type Tabs
  tabRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 10,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 14,
  },
  tabTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  // Duration Buttons (For Challenges)
  durationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  durationBtn: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  durationBtnSelected: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)', // Faint blue
    borderColor: colors.primary,
  },
  durationText: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
  durationTextSelected: {
    color: colors.primary,
    fontWeight: '700',
  },
  // Submit Button
  shareButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 30,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});