import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'; // <--- Import added here
import { Ionicons } from '@expo/vector-icons';

// Screens
import { HomeFeedScreen } from '../screens/HomeFeedScreen';
import { CreatePostScreen } from '../screens/CreatePostScreen';
import { SplashScreen } from '../screens/SplashScreen';
import { ProgressScreen } from '../screens/ProgressScreen';
import { ChallengeScreen } from '../screens/ChallengeScreen';
import { ChallengeDetailsScreen } from '../screens/ChallengeDetailsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { CommentsScreen } from '../screens/CommentsScreen'; 
import { FollowersScreen, FollowingScreen } from '../screens/FollowersScreen';
import { SearchScreen } from '../screens/SearchScreen'; // <--- Import Search Screen

import { colors } from '../theme/colors';
import { Post } from '@tier1fitness_app/types';

export type RootStackParamList = {
  Splash: undefined;
  Tabs: undefined;
  
  // Stacks
  Profile: { userId?: string }; 
  Comments: { post: Post }; 
  Followers: { userId: string, title: string };
  Following: { userId: string, title: string };
  ChallengeDetails: { challengeId: string };
  Search: undefined; // <--- Add Search Route

  // Tab Shortcuts
  HomeFeed: undefined;
  Challenges: undefined;
  CreatePost: undefined;
  Progress: undefined;
  MyProfileTab: undefined;
};

const Tab = createBottomTabNavigator<RootStackParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const TabBarIcon = ({ focused, label, iconName }: { 
  focused: boolean, 
  label: string, 
  iconName: keyof typeof Ionicons.glyphMap 
}) => {
  const color = focused ? colors.primary : colors.textSecondary; 
  return (
    <View style={styles.tabIconContainer}>
      <Ionicons name={iconName} size={24} color={color} />
      <Text style={[styles.tabIconText, { color }]}>
        {label}
      </Text>
    </View>
  );
};

const TabsNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarShowLabel: false,
      tabBarStyle: {
        height: 80,
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: 10,
      },
      headerStyle: {
        backgroundColor: colors.background,
        shadowOpacity: 0,
        elevation: 0,
      },
      headerTitleStyle: {
        color: colors.text,
        fontWeight: '800',
        fontSize: 24,
      },
      headerTitleAlign: 'left',
    }}
  >
    <Tab.Screen
      name="HomeFeed"
      component={HomeFeedScreen}
      options={({ navigation }) => ({
        title: 'Tier1Fitness',
        tabBarIcon: ({ focused }) => (
          <TabBarIcon focused={focused} label="Home" iconName="home-outline" />
        ),
        headerRight: () => (
          <TouchableOpacity 
            onPress={() => navigation.navigate('Search')}
            style={{ marginRight: 15 }}
          >
            <Ionicons name="search" size={24} color={colors.text} />
          </TouchableOpacity>
        ),
      })}
    />
    <Tab.Screen
      name="Challenges"
      component={ChallengeScreen}
      options={{
        title: 'Challenges',
        tabBarIcon: ({ focused }) => (
          <TabBarIcon focused={focused} label="Challenges" iconName="flash-outline" />
        ),
      }}
    />
    <Tab.Screen
      name="CreatePost"
      component={CreatePostScreen}
      options={{
        title: 'New Post',
        tabBarIcon: ({ focused }) => (
          <TabBarIcon focused={focused} label="Post" iconName="add-circle-outline" />
        ),
      }}
    />
    <Tab.Screen
      name="Progress"
      component={ProgressScreen}
      options={{
        title: 'Progress',
        tabBarIcon: ({ focused }) => (
          <TabBarIcon focused={focused} label="Stats" iconName="stats-chart-outline" />
        ),
      }}
    />
    <Tab.Screen
      name="MyProfileTab"
      component={ProfileScreen}
      options={{
        title: 'My Profile',
        tabBarIcon: ({ focused }) => (
          <TabBarIcon focused={focused} label="Profile" iconName="person-outline" />
        ),
      }}
    />
  </Tab.Navigator>
);

export const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator 
      initialRouteName="Splash" 
      screenOptions={{ 
        headerShown: false,
        
        headerTintColor: colors.text,
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Tabs" component={TabsNavigator} />
      
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ 
          headerShown: true,
          title: 'Profile', 
          headerStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
        }} 
      />

      <Stack.Screen
        name="Comments"
        component={CommentsScreen}
        options={{
          presentation: 'modal', 
          headerShown: true,
          title: 'Comments',
          headerStyle: { backgroundColor: colors.surface },
          headerShadowVisible: false,
        }}
      />
      
      <Stack.Screen 
        name="ChallengeDetails" 
        component={ChallengeDetailsScreen} 
        options={{ 
          headerShown: true,
          title: 'Challenge',
          headerStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
        }} 
      />

      <Stack.Screen 
        name="Search" 
        component={SearchScreen} 
        options={{ headerShown: false, 
          
         }} 
      />

      <Stack.Screen
        name="Followers"
        component={FollowersScreen}
        options={({ route }) => ({
          title: route.params.title,
          headerShown: true,
          headerStyle: { backgroundColor: colors.surface },
        })}
      />
      <Stack.Screen
        name="Following"
        component={FollowingScreen}
        options={({ route }) => ({
          title: route.params.title,
          headerShown: true,
          headerStyle: { backgroundColor: colors.surface },
        })}
      />

    </Stack.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
  },
  tabIconText: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: '600',
  },
});