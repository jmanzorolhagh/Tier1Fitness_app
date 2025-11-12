import React from 'react';
import { View } from 'react-native';
import Leaderboard from './src/leaderboard';
import CreatePostScreen from './src/postScreen';

export default function App() {
    const id = "123"
  return (
    <View style={{ flex: 1, paddingTop: 50 }}>;
      <CreatePostScreen userId={id} />
    </View>
  );
}
