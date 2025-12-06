import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { HomeFeedScreen } from '../screens/HomeFeedScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { CreatePostScreen } from '../screens/CreatePostScreen';
import { ProgressScreen } from '../screens/ProgressScreen';
import { SplashScreen } from '../screens/SplashScreen';
import { colors } from '../theme/colors';
import { ChallengeScreen } from 'src/screens/ChallengeScreen';
import { CommentsScreen } from '../screens/CommentsScreen';


export type RootStackParamList = {
  Splash: undefined;
  Tabs: undefined;
  HomeFeed: undefined;
  Progress: undefined;
  Challenges: undefined;
  CreatePost: undefined;
  Profile: {userId: string};
  Comments: { postId: string };

};

const Tab = createBottomTabNavigator<RootStackParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const TabBarIcon = ({ focused, label, iconName }: { 
  focused: boolean, 
  label: string, 
  iconName: keyof typeof Ionicons.glyphMap 
}) => {
  const color = focused ? colors.background : colors.textSecondary; 
  return (
    <View style={styles.tabIconContainer}>
      <Ionicons name={iconName} size={30} color={color} />
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
        height: 70,
        backgroundColor: colors.text,
        borderTopWidth: 0,
      },
      tabBarItemStyle: {
        justifyContent: 'flex-start',
        paddingTop: 10,
        alignItems: 'center',
      },
      headerStyle: {
        backgroundColor: colors.background,
        shadowOpacity: 0.05,
        elevation: 3,
        height: 90,
      },
      headerTitleAlign: 'left',
      headerTitleStyle: {
        color: colors.text,
        fontWeight: 'bold',
        fontSize: 24,
      },
      headerTitleContainerStyle: {
        paddingLeft: 18,
      },
    }}
  >
    <Tab.Screen
      name="HomeFeed"
      component={HomeFeedScreen}
      options={{
        title: 'Tier1Fitness',
        tabBarIcon: ({ focused }) => (
          <TabBarIcon focused={focused} label="Home" iconName="home-outline" />
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
  </Tab.Navigator>
);

export const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Tabs" component={TabsNavigator} />
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ 
          presentation: 'modal', 
          headerShown: true,     
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitle: '',      
        }} 
      />
      <Stack.Screen
          name="Comments"
          component={CommentsScreen}
          options={{
            presentation: "transparentModal",
            headerShown: false,
            animation: "slide_from_bottom"
          }}
        />
        



    </Stack.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    width: '100%',
  },
  tabIconText: {
    fontSize: 12,
    marginTop: 4,
  },
});
