import React from 'react';
import { View } from 'react-native';
import Leaderboard from './src/leaderboard';

export default function App() {
  return (
    <View style={{ flex: 1, paddingTop: 50 }}>
      <Leaderboard />
    </View>
  );
}
