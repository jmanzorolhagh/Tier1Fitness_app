import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');
const ACTIVE_POP_COLOR = '#10B981'; // Emerald Green
export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  
  // --- HEADER ---
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  header: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },

  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#1E293B', 
    borderRadius: 16,
    padding: 4,
    marginBottom: 30,
    height: 50,
  },
  toggleItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 2, // Prepare for border
    borderColor: 'transparent', // Invisible by default
  },
  toggleItemActive: {
    backgroundColor: colors.surface, 
    borderColor: ACTIVE_POP_COLOR, // <--- THE GREEN POP
    shadowColor: ACTIVE_POP_COLOR, // Optional: Green glow shadow
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  toggleText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  toggleTextActive: {
    color: ACTIVE_POP_COLOR, 
    fontWeight: '800',
  },

  // --- INPUTS ---
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 12,
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    borderRadius: 16,
    padding: 18,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 20,
  },

  // --- CHIPS (Categories / Metrics) ---
  tabRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
    gap: 10,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  tabSelected: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)', // Faint blue tint
    borderColor: colors.primary,
  },
  tabText: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 14,
  },
  tabTextSelected: {
    color: colors.primary,
    fontWeight: '700',
  },

  // --- DURATION SELECTOR ---
  durationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 6,
  },
  durationBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  durationBtnSelected: {
    backgroundColor: colors.primary,
  },
  durationText: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 13,
  },
  durationTextSelected: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  // --- SUBMIT BUTTON ---
  shareButton: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});