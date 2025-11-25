import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

const CreatePostStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: colors.background,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  label: {
    marginTop: 16,
    marginBottom: 6,
    fontWeight: '600',
    fontSize: 15,
    color: colors.textSecondary,
  },
  tabRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 10,
  },
  tab: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  tabSelected: {
    borderColor: colors.primary,
    backgroundColor: '#E6F1FC',
  },
  tabText: {
    color: '#444',
    fontWeight: '600',
  },
  tabTextSelected: {
    color: colors.primary,
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 50,
    marginBottom: 12,
    color: colors.text,
  },
  shareButton: {
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shareButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default CreatePostStyles;
