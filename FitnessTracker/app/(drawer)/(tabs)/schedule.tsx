import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  Alert, StyleSheet, useColorScheme,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WorkoutScheduler from '@/components/WorkoutScheduler';
import { useWorkoutScheduler } from '@/hooks/useWorkoutScheduler';
import { Ionicons } from '@expo/vector-icons';

export default function ScheduleScreen() {
  const isDark = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets();
  const { scheduledWorkouts, cancelScheduledWorkout } = useWorkoutScheduler();

  const bg    = isDark ? '#0d1117' : '#f0f4ff';
  const card  = isDark ? '#1c2333' : '#ffffff';
  const text  = isDark ? '#f1f5f9' : '#0f172a';
  const sub   = isDark ? '#64748b' : '#94a3b8';
  const border = isDark ? '#1e293b' : '#e2e8f0';

  const handleCancel = (id: string) => {
    Alert.alert('Cancel Workout', 'Remove this scheduled workout?', [
      { text: 'Keep', style: 'cancel' },
      {
        text: 'Remove', style: 'destructive',
        onPress: async () => {
          await cancelScheduledWorkout(id);
        },
      },
    ]);
  };

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: bg },
    header: {
      paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16,
      backgroundColor: isDark ? '#064e3b' : '#10b981',
    },
    headerTitle: { fontSize: 26, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
    headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
    page: { padding: 20 },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: text, marginBottom: 14 },
    workoutCard: {
      backgroundColor: card, borderRadius: 18, padding: 16, marginBottom: 12,
      borderWidth: 1, borderColor: border,
      shadowColor: isDark ? '#000' : '#10b981',
      shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
    },
    workoutRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    workoutIconWrap: {
      width: 40, height: 40, borderRadius: 12,
      backgroundColor: isDark ? '#064e3b' : '#d1fae5',
      alignItems: 'center', justifyContent: 'center',
    },
    workoutTitle: { fontSize: 15, fontWeight: '700', color: text, flex: 1 },
    workoutDesc: { fontSize: 13, color: sub, marginTop: 4 },
    workoutTime: { fontSize: 12, color: isDark ? '#6ee7b7' : '#059669', marginTop: 6, fontWeight: '600' },
    cancelBtn: {
      marginTop: 12, paddingVertical: 8, borderRadius: 10,
      borderWidth: 1.5, borderColor: '#ef4444',
      alignItems: 'center',
    },
    cancelBtnText: { color: '#ef4444', fontWeight: '700', fontSize: 13 },
  });

  return (
    <View style={s.container}>
      <View style={[s.header, { paddingTop: insets.top + 16 }]}>
        <Text style={s.headerTitle}>Schedule</Text>
        <Text style={s.headerSub}>Plan your upcoming workouts</Text>
      </View>

      <ScrollView contentContainerStyle={s.page} showsVerticalScrollIndicator={false}>

        <WorkoutScheduler onSchedule={() => {}} />

        {scheduledWorkouts.length > 0 && (
          <View style={{ marginTop: 28 }}>
            <Text style={s.sectionTitle}>Upcoming ({scheduledWorkouts.length})</Text>
            {scheduledWorkouts.map((workout) => (
              <View key={workout.id} style={s.workoutCard}>
                <View style={s.workoutRow}>
                  <View style={s.workoutIconWrap}>
                    <Ionicons name="barbell" size={20} color={isDark ? '#6ee7b7' : '#059669'} />
                  </View>
                  <Text style={s.workoutTitle}>{workout.title}</Text>
                </View>
                {workout.description ? (
                  <Text style={s.workoutDesc}>{workout.description}</Text>
                ) : null}
                <Text style={s.workoutTime}>
                  <Ionicons name="time-outline" size={12} /> {' '}
                  {workout.scheduledTime.toLocaleString('en-US', {
                    weekday: 'short', month: 'short', day: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </Text>
                <TouchableOpacity style={s.cancelBtn} onPress={() => handleCancel(workout.id)} activeOpacity={0.75}>
                  <Text style={s.cancelBtnText}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

      </ScrollView>
    </View>
  );
}
