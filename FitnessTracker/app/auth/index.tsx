import React from 'react';
import { View } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import AuthScreen from '@/components/AuthScreen';

export default function AuthScreenPage() {
  const { user } = useAuth();

  // If already logged in
  if (user) {
    return <Redirect href="/(drawer)/(tabs)/index" />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <AuthScreen onAuthSuccess={() => {}} />
    </View>
  );
}