import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const ProgressScreen = () => {
  const [steps, setSteps] = useState(7500);
  const [calories, setCalories] = useState(300);

  useEffect(() => {
    const interval = setInterval(() => {
      setSteps(prev => prev + Math.floor(Math.random() * 100));
      setCalories(prev => prev + Math.floor(Math.random() * 5));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Your Progress</Text>
      <View style={styles.card}>
        <Text style={styles.title}>Steps Taken</Text>
        <Text style={styles.value}>{steps}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>Calories Burned</Text>
        <Text style={styles.value}>{calories}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  card: { padding: 20, borderRadius: 10, backgroundColor: '#f5f5f5', marginBottom: 15 },
  title: { fontSize: 18, marginBottom: 5 },
  value: { fontSize: 22, fontWeight: 'bold' },
});

export default ProgressScreen;
