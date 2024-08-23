import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import React from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import 'react-native-reanimated';
import FontLoader from '../components/FontLoader';

import { useColorScheme } from '@/hooks/useColorScheme';

import '@expo/match-media';




// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();


export default function RootLayout() {
  const colorScheme = useColorScheme();
  

  return (
   
    <FontLoader>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          {/* <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> */}
          <Stack.Screen name="+not-found" />
          <Stack.Screen name="index" options={{ headerShown: false }}/>
          <Stack.Screen name="dashboard" options={{ headerShown: false }}  />
          <Stack.Screen name="formulaire" options={{ headerShown: false }}  />
          <Stack.Screen name="notes" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </FontLoader>
  );
}
