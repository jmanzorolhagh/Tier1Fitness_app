import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { View, StyleSheet } from 'react-native';
import { colors } from './src/theme/colors';

export default function App() {
  return (
    <SafeAreaProvider>

      <View style={styles.appContainer}>
        <AppNavigator />
        <StatusBar style="light" /> 
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: colors.text, 
  }
});