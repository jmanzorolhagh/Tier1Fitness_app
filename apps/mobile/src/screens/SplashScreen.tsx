import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import styles from './SplashScreenStyles';
import { colors } from '../theme/colors';
import api, { MY_DEMO_USER_ID } from '../services/api'; // Import the ID
import { UserService } from '../services/userService';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Ionicons } from '@expo/vector-icons';
import { User } from '@tier1fitness_app/types';

type SplashNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

export const SplashScreen = () => {
  const [isLogin, setIsLogin] = useState(false);
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation<SplashNavigationProp>();
  const insets = useSafeAreaInsets();

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Missing Info', 'Please enter email and password.');
      return;
    }
    if (!isLogin && !username) {
      Alert.alert('Missing Info', 'Please enter a username.');
      return;
    }

    setLoading(true);
    try {
      let user: User;

      if (isLogin) {
        console.log('Attempting Login:', email);
        user = await api.post('/login', { email, password });
      } else {
        console.log('Attempting Sign Up:', email);
        user = await api.post('/users/create', { username, email, password });
      }

      console.log('Auth Success:', user);
      await UserService.saveUser(user);
      navigation.replace('Tabs');

    } catch (e: any) {
      const message = e.message || 'An error occurred';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };
  const handleSkip = async () => {
    const guestUser: User = {
      id: MY_DEMO_USER_ID,
      username: 'DemoUser',
      email: 'demo@tier1fitness.com',
      created: new Date().toISOString(),
    };

    console.log('Skipping login... defaulting to Demo User:', guestUser.id);
    
    await UserService.saveUser(guestUser);
    navigation.replace('Tabs');
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView 
        contentContainerStyle={[
          styles.container,
          {
            paddingTop: insets.top + 20,
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
          }
        ]}
      >
        <View style={styles.logoContainer}>
          <Ionicons name="fitness-outline" size={64} color={colors.primary} />
          <Text style={styles.title}>Tier1 Fitness</Text>
          <Text style={styles.subtitle}>
            {isLogin ? 'Welcome back! 👋' : 'Join the movement! 🚀'}
          </Text>
        </View>

        {!isLogin && (
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor={colors.textSecondary}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.textSecondary}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={colors.textSecondary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleAuth}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryButtonText}>
              {isLogin ? 'Log In' : 'Create Account'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleMode} style={{ marginTop: 20, padding: 10 }}>
          <Text style={{ color: colors.textSecondary, textAlign: 'center' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Text style={{ color: colors.primary, fontWeight: 'bold' }}>
              {isLogin ? 'Sign Up     ' : 'Log In     '}
            </Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Skip for now (Guest Mode)</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};