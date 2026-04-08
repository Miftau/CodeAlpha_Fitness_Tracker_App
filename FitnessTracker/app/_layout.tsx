import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../global.css';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* Main drawer navigator (which contains tabs inside) */}
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        {/* Auth flow */}
        <Stack.Screen name="auth/index" options={{ headerShown: false }} />
        {/* Secondary stack screens */}
        <Stack.Screen name="tracker/index" options={{ title: 'Auto Tracker', headerBackTitle: 'Back' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
