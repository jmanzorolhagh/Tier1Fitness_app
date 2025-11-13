import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import style from './ProgressScreenStyles';

export default function ProgressScreen() {
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const durationSeconds = 60; // You can change this

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (running && progress < 100) {
      interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + 1;
          if (next >= 100) {
            clearInterval(interval);
            setRunning(false);
            setCompleted(true);
          }
          return next;
        });
      }, (durationSeconds * 1000) / 100);
    }

    return () => clearInterval(interval);
  }, [running]);

  useEffect(() => {
    Animated.timing(animation, {
      toValue: progress,
      duration: 100,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const start = () => {
    if (!running) {
      setCompleted(false);
      setProgress(0);
      setRunning(true);
    }
  };

  const reset = () => {
    setRunning(false);
    setProgress(0);
    setCompleted(false);
  };

  const progressWidth = animation.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Progress Screen</Text>
      <Text style={styles.status}>
        {completed ? '✅ Completed!' : running ? '⏳ Running...' : 'Idle'}
      </Text>

      <View style={styles.barContainer}>
        <Animated.View style={[styles.barFill, { width: progressWidth }]} />
      </View>
      <Text style={styles.percent}>{Math.floor(progress)}%</Text>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, running && styles.disabled]}
          onPress={start}
          disabled={running}
        >
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={reset}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
  },
  status: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 20,
  },
  barContainer: {
    width: '100%',
    height: 20,
    backgroundColor: '#E2E8F0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#0EA5E9',
  },
  percent: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
  },
  buttons: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 30,
  },
  button: {
    backgroundColor: '#0284C7',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});