import React from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { View, Text } from 'react-native';

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Loading...</Text></View>;
  }

  // Redirect to appropriate screen based on auth state
  if (!user) {
    return <Redirect href="/auth" />;
  }

  return <Redirect href="/dashboard" />;
}