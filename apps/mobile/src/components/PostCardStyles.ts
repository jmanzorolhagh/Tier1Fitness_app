import { StyleSheet, Platform } from 'react-native';
import { colors } from '../theme/colors';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface, 
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 20,    
    overflow: 'hidden',  
    
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6, 
      },
    }),
    borderWidth: 1,
    borderColor: '#2A2A2A', 
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

  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20, 
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
    backgroundColor: 'rgba(255, 255, 255, 0.02)', 
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
    paddingBottom: 16, 
  },
  caption: {
    fontSize: 15,
    lineHeight: 24,
    color: '#E0E0E0',
  }
});