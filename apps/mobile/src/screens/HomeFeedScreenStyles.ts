import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContainer: {
    paddingBottom: 20,
  },
  centerAll: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    marginTop: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorText: {
    marginTop: 8,
    color: colors.accent,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  infoText: {
    marginTop: 8,
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: 16,
  },
   challengePostCard: {
    borderWidth: 2,        
    borderColor: 'rgba(239, 183, 16, 0.94)',     
    borderRadius: 15,
    marginHorizontal: 10,
    marginVertical: 10,
  },
   
});


export default styles;
