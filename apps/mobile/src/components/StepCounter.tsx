import React, { useState, useEffect } from 'react';
import { Pedometer } from 'expo-sensors';
import { Alert, Linking, AppState } from 'react-native'; // Added Linking
import api from '../services/api';
import { UserService } from '../services/userService';

interface StepData {
  currentSteps: number;
  calories: number;
  distance: number;
}

interface StepCounterProps {
  onDataUpdate: (data: StepData) => void;
}

export const StepCounter: React.FC<StepCounterProps> = ({ onDataUpdate }) => {
  const [historySteps, setHistorySteps] = useState(0);
  
  const updateParent = (history: number, current: number) => {
    const total = history + current;
    const calories = Math.floor(total * 0.04);
    const distance = parseFloat((total * 0.0008).toFixed(2));
    onDataUpdate({ currentSteps: total, calories, distance });
    syncToBackend(total);
  };

  const syncToBackend = async (steps: number) => {
    if (steps === 0) return;
    const user = await UserService.getUser();
    if (!user) return;
    try {
      await api.post('/healthdata', {
        userId: user.id,
        steps: steps,
        calories: Math.floor(steps * 0.04),
      });
    } catch (e) {
      // Fail silently
    }
  };

  const showSettingsAlert = () => {
    Alert.alert(
      "Permission Required",
      "Step tracking is currently blocked. Please go to Settings > Permissions and allow 'Physical Activity' or 'Motion' access.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Open Settings", onPress: () => Linking.openSettings() }
      ]
    );
  };

  useEffect(() => {
    let subscription: Pedometer.Subscription | null = null;

    const startTracking = async () => {
      try {
        const isAvailable = await Pedometer.isAvailableAsync();
        console.log('[Pedometer] Available:', isAvailable);
        
        if (!isAvailable) return;

        // requestPermissionsAsync will return the current status if already decided
        const perm = await Pedometer.requestPermissionsAsync();
        console.log('[Pedometer] Permission:', perm.status);

        if (perm.status !== 'granted') {
          // If denied, show the manual fix dialog
          showSettingsAlert();
          return;
        }

        // --- Permission Granted: Start Tracking ---

        const end = new Date();
        const start = new Date();
        start.setHours(0, 0, 0, 0);

        const pastResult = await Pedometer.getStepCountAsync(start, end);
        setHistorySteps(pastResult.steps);
        updateParent(pastResult.steps, 0);

        subscription = Pedometer.watchStepCount(result => {
          updateParent(pastResult.steps, result.steps);
        });

      } catch (error) {
        console.log('[Pedometer] Error:', error);
      }
    };

    startTracking();

    return () => {
      if (subscription) subscription.remove();
    };
  }, []);

  return null;
};