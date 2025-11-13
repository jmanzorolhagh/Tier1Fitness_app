import React from 'react';
import { StatusBar, View } from 'react-native';
import Leaderboard from './src/leaderboard';
import CreatePostScreen from './src/postScreen';
import CommunityFeedScreen from './src/communityFeed';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function App() {
  const userId = "123";

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="CommunityFeed" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="CreatePost">
          {(props) => <CreatePostScreen {...props} userId={userId} />}
        </Stack.Screen>
        <Stack.Screen name="CommunityFeed" component={CommunityFeedScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
