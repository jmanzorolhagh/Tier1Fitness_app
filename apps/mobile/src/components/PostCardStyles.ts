import { StyleSheet, Platform } from 'react-native';
import { colors } from '../theme/colors';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface, // Ensure this is a distinct color from the background (e.g., #1E1E1E vs #121212)
    borderRadius: 16,
    marginHorizontal: 16, // Pulls the card away from the screen edges
    marginBottom: 20,     // Adds space between cards
    overflow: 'hidden',   // Clips the image to match the rounded corners
    
    // --- Shadow & Elevation (The "Sleek" Look) ---
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6, // Adds depth on Android
      },
    }),
    borderWidth: 1,
    borderColor: '#2A2A2A', // Very subtle border for definition
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 12,
    backgroundColor: colors.border,
  },
  headerText: {
    flexDirection: 'column',
    flex: 1, 
  },
  username: {
    fontWeight: '700',
    color: colors.text,
    fontSize: 16,
    marginBottom: 2,
  },
  timestamp: { 
    fontSize: 12,
    color: colors.textSecondary,
  },
  // Badge styling from previous step
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20, // More rounded for the sleek look
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  image: {
    width: '100%',
    backgroundColor: '#252525', 
  },
  actionBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.02)', // Very subtle contrast for the action bar
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionText: {
    marginLeft: 8,
    fontWeight: '600',
    color: colors.text,
    fontSize: 14,
  },
  captionContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16, // More breathing room
  },
  caption: {
    fontSize: 15,
    lineHeight: 24, // Better readability
    color: '#E0E0E0',
  }
});