import React from 'react';
import { StatusBar, View } from 'react-native';
import Leaderboard from './src/leaderboard';
import CreatePostScreen from './src/postScreen';
import CommunityFeedScreen from './src/communityFeed';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function App() {
  const userId = "123"; // mock user for now

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="postScreen">
        <Stack.Screen 
          name="postScreen" 
          component={CommunityFeedScreen} 
          options={{ title: 'Tier1Fitness Feed' }} 
        />
        <Stack.Screen 
          name="CreatePost" 
          options={{ title: 'Create Post' }}
        >
          {props => <CreatePostScreen {...props} userId={userId} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
