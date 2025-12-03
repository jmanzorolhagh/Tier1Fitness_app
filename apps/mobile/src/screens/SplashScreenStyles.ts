import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    marginTop: 6,
    textAlign: 'center',
    width: '100%'
  },
   input: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
    color: '#fff',
  },
  primaryButton: {
    width: '100%',
    borderRadius: 10,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  skipButton: {
    marginTop: 16,
  },
  skipButtonText: {
    color: colors.textSecondary,
    fontSize: 15,
    textDecorationLine: 'underline',
  },
});

export default styles;
