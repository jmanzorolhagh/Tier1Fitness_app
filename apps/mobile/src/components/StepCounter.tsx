import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Linking, 
  AppState 
} from 'react-native';
import { Pedometer } from 'expo-sensors';
import { colors } from '../theme/colors';
import api, { MY_DEMO_USER_ID } from '../services/api';

export const StepCounter = () => {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [permissionStatus, setPermissionStatus] = useState('undetermined');
  const [pastStepCount, setPastStepCount] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);

  const checkPermissionAndSubscribe = async () => {
    const isAvailable = await Pedometer.isAvailableAsync();
    setIsPedometerAvailable(String(isAvailable));
    if (!isAvailable) {
      setPermissionStatus('unavailable');
      return;
    }

    const { status } = await Pedometer.getPermissionsAsync();
    setPermissionStatus(status);

    if (status === 'granted') {
      const end = new Date();
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const pastSteps = await Pedometer.getStepCountAsync(start, end);
      if (pastSteps) {
        setPastStepCount(pastSteps.steps);
        sendStepsToApi(pastSteps.steps); 
      }

      return Pedometer.watchStepCount(result => {
        setCurrentStepCount(result.steps);
      });
    }
  };

  useEffect(() => {
    let subscription: Pedometer.Subscription | undefined;

    checkPermissionAndSubscribe().then(sub => {
      subscription = sub;
    });

    const appStateSubscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        console.log('App has come to the foreground, re-checking permissions...');
        checkPermissionAndSubscribe().then(sub => {
          subscription = sub;
        });
      }
    });

    return () => {
      subscription?.remove();
      appStateSubscription.remove();
    };
  }, []); 


  const sendStepsToApi = async (steps: number) => {

    if (MY_DEMO_USER_ID === 'YOUR_HARDCODED_USER_ID' || !MY_DEMO_USER_ID) {
      console.warn('StepCounter: MY_DEMO_USER_ID is not set in api.ts. Steps will not be saved.');
      return;
    }
    try {
      await api.post('/healthdata', {
        userId: MY_DEMO_USER_ID,
        steps: steps,
        calories: Math.floor(steps * 0.04), 
      });
      console.log(`Successfully saved ${steps} steps to the database.`);
    } catch (error) {
      console.error('Failed to save steps to API:', error);
    }
  };
  
  useEffect(() => {
    const totalSteps = pastStepCount + currentStepCount;
    if (totalSteps === 0) return; 

    const interval = setInterval(() => {
      sendStepsToApi(totalSteps);
    }, 30000); 

    return () => clearInterval(interval);
  }, [pastStepCount, currentStepCount]);



  if (permissionStatus === 'undetermined' || isPedometerAvailable === 'checking') {
    return (
      <View style={styles.container}>
        <Text style={styles.infoText}>Checking permissions...</Text>
      </View>
    );
  }

  if (permissionStatus === 'unavailable') {
    return (
      <View style={styles.container}>
        <Text style={styles.infoText}>Step tracking is not available on this device.</Text>
      </View>
    );
  }

  if (permissionStatus === 'denied') {
    return (
      <View style={styles.container}>
        <Text style={styles.infoText}>Motion permission is required to track steps.</Text>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => Linking.openSettings()} 
        >
          <Text style={styles.buttonText}>Grant Access in Settings</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const totalSteps = pastStepCount + currentStepCount;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Steps Today</Text>
      <Text style={styles.stepCount}>{totalSteps.toLocaleString()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    margin: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  stepCount: {
    fontSize: 42,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 5,
  },
  infoText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center'
  },
  button: {
    marginTop: 15,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  }
});