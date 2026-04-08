import React from 'react';
import {
  View, Text, Alert, StyleSheet,
  useColorScheme, ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Timer from '@/components/Timer';
import { useActivities } from '@/hooks/useActivities';
import { Ionicons } from '@expo/vector-icons';

export default function TimerScreen() {
  const isDark = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets();
  const { logActivity } = useActivities();

  const bg = isDark ? '#0d1117' : '#f0f4ff';
  const card = isDark ? '#1c2333' : '#ffffff';
  const text = isDark ? '#f1f5f9' : '#0f172a';
  const sub  = isDark ? '#64748b' : '#94a3b8';
  const border = isDark ? '#1e293b' : '#e2e8f0';

  const handleTimerComplete = async (duration: number) => {
    try {
      await logActivity({
        type: 'workout',
        value: Math.round(duration / 60),
        unit: 'minutes',
        notes: `Timed workout — ${Math.floor(duration / 60)} min ${duration % 60} sec`,
        date: new Date().toISOString().split('T')[0],
      });
      Alert.alert('Workout Saved 🎉', `Duration: ${Math.floor(duration / 60)} min ${duration % 60} sec`);
    } catch {
      Alert.alert('Error', 'Failed to save workout.');
    }
  };

  const tips = [
    { icon: 'play-circle' as const,     text: 'Hit Start to begin timing your workout' },
    { icon: 'pause-circle' as const,    text: 'Pause at any point to rest' },
    { icon: 'checkmark-circle' as const, text: 'Stop to auto-save your session' },
  ];

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: bg },
    header: {
      paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16,
      backgroundColor: isDark ? '#78350f' : '#f59e0b',
    },
    headerTitle: { fontSize: 26, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
    headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
    page: { padding: 20 },
    tipsCard: {
      backgroundColor: card, borderRadius: 20, padding: 20,
      marginTop: 24, borderWidth: 1, borderColor: border,
    },
    tipsTitle: { fontSize: 14, fontWeight: '700', color: text, marginBottom: 14 },
    tipRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 12 },
    tipText: { fontSize: 13, color: sub, flex: 1 },
  });

  return (
    <View style={s.container}>
      <View style={[s.header, { paddingTop: insets.top + 16 }]}>
        <Text style={s.headerTitle}>Workout Timer</Text>
        <Text style={s.headerSub}>Time and auto-save your sessions</Text>
      </View>
      <ScrollView contentContainerStyle={s.page} showsVerticalScrollIndicator={false}>
        <Timer onComplete={handleTimerComplete} />

        <View style={s.tipsCard}>
          <Text style={s.tipsTitle}>How it works</Text>
          {tips.map((tip, i) => (
            <View key={i} style={s.tipRow}>
              <Ionicons name={tip.icon} size={22} color="#f59e0b" />
              <Text style={s.tipText}>{tip.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
