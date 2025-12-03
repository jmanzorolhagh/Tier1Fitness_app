import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // Dark background
    paddingTop: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text, // White text
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary, // Light gray for labels
    marginBottom: 8,
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
    backgroundColor: colors.primary, // Blue when selected
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