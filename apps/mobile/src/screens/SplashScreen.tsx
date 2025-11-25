import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import styles from './SplashScreenStyles';
import { colors } from '../theme/colors';
import api from '../services/api';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Ionicons } from '@expo/vector-icons';
import { User } from '@tier1fitness_app/types';

type SplashNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

export const SplashScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation<SplashNavigationProp>();
  const insets = useSafeAreaInsets();

  const handleCreateUser = async () => {
    if (!username || !email || !password) {
      Alert.alert('Error', 'Please enter username, email, and password.');
      return;
    }

    setLoading(true);
    try {
      const response: User = await api.post('/users/create', {
        username,
        email,
        password,
      });
      console.log('Created user:', response);
      navigation.replace('Tabs'); 
    } catch (e: any) {
      Alert.alert('Signup Failed', e.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigation.replace('Tabs');
  };

  return (
    <View style={[
      styles.container,
      {
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }
    ]}>
     
      <View style={styles.logoContainer}>
        <Ionicons name="fitness-outline" size={64} color={colors.primary} />
        <Text style={styles.title}>Tier1 Fitness</Text>
        <Text style={styles.subtitle}>Welcome to the family!  </Text>
      </View>

  
      <TextInput
        style={styles.input}
        placeholder="Enter username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />


      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handleCreateUser}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryButtonText}>Create Account</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipButtonText}>Skip for now</Text>
      </TouchableOpacity>
    </View>
  );
};
