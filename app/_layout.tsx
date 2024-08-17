import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FontLoader from '../components/FontLoader';

import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
