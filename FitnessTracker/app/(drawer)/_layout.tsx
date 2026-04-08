import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, useColorScheme, Text, TouchableOpacity } from 'react-native';
import { Redirect } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { useBiometrics } from '@/hooks/useBiometrics';

export default function DrawerLayout() {
  const isDark = useColorScheme() === 'dark';
  const { user, loading: authLoading } = useAuth();
  const { authenticate, loading: bioLoading, isBiometricsEnabled } = useBiometrics();
  
  const [bioAuthenticated, setBioAuthenticated] = useState(false);
  const [isPrompting, setIsPrompting] = useState(false);

  useEffect(() => {
     const runBiometrics = async () => {
         if (user && !authLoading && !bioLoading && isBiometricsEnabled && !bioAuthenticated && !isPrompting) {
             setIsPrompting(true);
             const success = await authenticate();
             if (success) {
                 setBioAuthenticated(true);
             }
             setIsPrompting(false);
         } else if (!isBiometricsEnabled && !bioLoading) {
             setBioAuthenticated(true);
         }
     };
     runBiometrics();
  }, [user, authLoading, bioLoading, isBiometricsEnabled, bioAuthenticated, isPrompting]);

  // 1. Auth Guard & Biometrics Guard
  if (authLoading || bioLoading || (user && isBiometricsEnabled && !bioAuthenticated)) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: isDark ? '#0d1117' : '#f0f4ff',
      }}>
        <Ionicons name="lock-closed" size={48} color="#6366f1" style={{ marginBottom: 20 }} />
        {isPrompting && <ActivityIndicator size="large" color="#6366f1" />}
        {!isPrompting && user && isBiometricsEnabled && !bioAuthenticated && (
            <TouchableOpacity onPress={() => authenticate().then(success => { if (success) setBioAuthenticated(true) })} style={{ marginTop: 20, padding: 12, backgroundColor: '#6366f1', borderRadius: 8 }}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Unlock App</Text>
            </TouchableOpacity>
        )}
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/auth" />;
  }

  // 2. Drawer Configuration
  const bg = isDark ? '#0d1117' : '#ffffff';
  const text = isDark ? '#f1f5f9' : '#0f172a';
  const activeTint = '#6366f1';
  const inactiveTint = isDark ? '#64748b' : '#94a3b8';

  return (
    <Drawer
      screenOptions={{
        headerShown: true, 
        headerTintColor: text,
        headerStyle: { backgroundColor: bg },
        drawerStyle: { backgroundColor: bg },
        drawerActiveTintColor: activeTint,
        drawerInactiveTintColor: inactiveTint,
        drawerLabelStyle: { fontWeight: '600' },
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: 'My Dashboard',
          title: 'Fitness Tracker',
          drawerIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      
      <Drawer.Screen
        name="settings"
        options={{
          drawerLabel: 'Settings',
          title: 'Settings',
          drawerIcon: ({ color, size }) => <Ionicons name="settings" size={size} color={color} />,
        }}
      />
    </Drawer>
  );
}
