import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  useColorScheme,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import WorkoutScheduler from '@/components/WorkoutScheduler';
import { useWorkoutScheduler, ScheduledWorkout } from '@/hooks/useWorkoutScheduler';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ScheduleScreen() {
  const isDark = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets();
  const { 
    scheduledWorkouts, 
    cancelScheduledWorkout, 
    markAsCompleted, 
    updateWorkout,
    refetch 
  } = useWorkoutScheduler();

  const [editingWorkout, setEditingWorkout] = useState<ScheduledWorkout | null>(null);

  // Auto-refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  // ── Palette ──────────────────────────────────────────────────────────────
  const bg = isDark ? '#0d1117' : '#f0f4ff';
  const card = isDark ? '#1c2333' : '#ffffff';
  const textPri = isDark ? '#f1f5f9' : '#0f172a';
  const textSub = isDark ? '#64748b' : '#94a3b8';
  const accent = '#6366f1';
  const success = '#10b981';
  const danger = '#ef4444';

  // ── Grouping Logic ───────────────────────────────────────────────────────
  const groupedWorkouts = useMemo(() => {
    const sorted = [...scheduledWorkouts].sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime());
    const groups: { title: string; data: ScheduledWorkout[] }[] = [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayWorkouts: ScheduledWorkout[] = [];
    const tomorrowWorkouts: ScheduledWorkout[] = [];
    const upcomingWorkouts: ScheduledWorkout[] = [];
    const pastWorkouts: ScheduledWorkout[] = [];

    sorted.forEach(w => {
      const wDate = new Date(w.scheduledTime);
      wDate.setHours(0, 0, 0, 0);

      if (w.completed) {
        pastWorkouts.push(w);
      } else if (wDate.getTime() === today.getTime()) {
        todayWorkouts.push(w);
      } else if (wDate.getTime() === tomorrow.getTime()) {
        tomorrowWorkouts.push(w);
      } else if (wDate.getTime() > today.getTime()) {
        upcomingWorkouts.push(w);
      } else {
        // Overdue or past uncompleted
        todayWorkouts.push(w); 
      }
    });

    if (todayWorkouts.length) groups.push({ title: 'Today', data: todayWorkouts });
    if (tomorrowWorkouts.length) groups.push({ title: 'Tomorrow', data: tomorrowWorkouts });
    if (upcomingWorkouts.length) groups.push({ title: 'Upcoming', data: upcomingWorkouts });
    if (pastWorkouts.length) groups.push({ title: 'Completed', data: pastWorkouts });

    return groups;
  }, [scheduledWorkouts]);

  const handleCancel = (workoutId: string) => {
    Alert.alert(
      'Cancel Workout',
      'Are you sure you want to remove this scheduled session? This will also cancel the notification.',
      [
        { text: 'Keep it', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await cancelScheduledWorkout(workoutId);
            refetch();
          },
        },
      ]
    );
  };

  const handleComplete = async (workoutId: string) => {
    markAsCompleted(workoutId);
    Alert.alert('Nice work!', 'Workout marked as completed.');
    refetch();
  };

  const handleEdit = (workout: ScheduledWorkout) => {
    setEditingWorkout(workout);
    // Potential: scroll top
  };

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: textPri }]}>Workout Schedule</Text>
          <Text style={[styles.headerSubtitle, { color: textSub }]}>Manage notifications & goals</Text>
        </View>

        <WorkoutScheduler 
          onSchedule={refetch} 
          initialData={editingWorkout ? {
            id: editingWorkout.id,
            title: editingWorkout.title,
            description: editingWorkout.description,
            scheduledTime: editingWorkout.scheduledTime
          } : undefined}
          onUpdate={async (id, updates) => {
            await updateWorkout(id, updates);
            refetch();
          }}
          onCancelEdit={() => setEditingWorkout(null)}
        />

        <View style={styles.timelineContainer}>
          {groupedWorkouts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={[styles.emptyIconCircle, { backgroundColor: isDark ? '#1e1b4b' : '#eef2ff' }]}>
                <Ionicons name="calendar-outline" size={32} color={accent} />
              </View>
              <Text style={[styles.emptyTitle, { color: textPri }]}>No Workouts Scheduled</Text>
              <Text style={[styles.emptyText, { color: textSub }]}>
                Planning ahead is the best way to stay consistent. Add your first session above!
              </Text>
            </View>
          ) : (
            groupedWorkouts.map((group, idx) => (
              <View key={group.title} style={styles.group}>
                <View style={styles.groupHeader}>
                  <View style={[styles.dot, { backgroundColor: accent }]} />
                  <Text style={[styles.groupTitle, { color: textPri }]}>{group.title}</Text>
                </View>

                {group.data.map((workout) => (
                  <View
                    key={workout.id}
                    style={[
                      styles.workoutCard,
                      { backgroundColor: card, shadowColor: isDark ? '#000' : '#6366f1' },
                      workout.completed && { opacity: 0.7 }
                    ]}
                  >
                    <View style={styles.cardMain}>
                      <View style={[styles.timeLabel, { backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }]}>
                        <Text style={[styles.timeText, { color: accent }]}>
                          {new Date(workout.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                      </View>
                      <View style={{ flex: 1, paddingLeft: 12 }}>
                        <Text style={[styles.workoutTitle, { color: textPri }, workout.completed && styles.strikethrough]}>
                          {workout.title}
                        </Text>
                        {workout.description ? (
                          <Text style={[styles.workoutDesc, { color: textSub }]} numberOfLines={1}>
                            {workout.description}
                          </Text>
                        ) : null}
                      </View>
                    </View>

                    <View style={styles.cardActions}>
                      {!workout.completed ? (
                        <>
                          <TouchableOpacity
                            onPress={() => handleComplete(workout.id)}
                            style={[styles.actionBtn, { backgroundColor: success + '15' }]}
                          >
                            <Ionicons name="checkmark-circle" size={18} color={success} />
                            <Text style={[styles.actionBtnText, { color: success }]}>Done</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => handleEdit(workout)}
                            style={[styles.actionBtn, { backgroundColor: accent + '15' }]}
                          >
                            <Ionicons name="create-outline" size={18} color={accent} />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => handleCancel(workout.id)}
                            style={[styles.actionBtn, { backgroundColor: danger + '15' }]}
                          >
                            <Ionicons name="trash-outline" size={18} color={danger} />
                          </TouchableOpacity>
                        </>
                      ) : (
                        <View style={styles.completedBadge}>
                          <Ionicons name="checkmark-done-circle" size={20} color={success} />
                          <Text style={[styles.completedText, { color: success }]}>Completed</Text>
                        </View>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  header: { marginBottom: 24 },
  headerTitle: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 14, fontWeight: '500', marginTop: 4 },
  timelineContainer: { marginTop: 32 },
  group: { marginBottom: 24 },
  groupHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  groupTitle: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  workoutCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  cardMain: { flexDirection: 'row', alignItems: 'center' },
  timeLabel: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  timeText: { fontSize: 13, fontWeight: '700' },
  workoutTitle: { fontSize: 16, fontWeight: '700' },
  workoutDesc: { fontSize: 13, marginTop: 2 },
  strikethrough: { textDecorationLine: 'line-through' },
  cardActions: {
    flexDirection: 'row',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 4,
  },
  actionBtnText: { fontSize: 12, fontWeight: '600' },
  completedBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  completedText: { fontSize: 12, fontWeight: '700' },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    paddingHorizontal: 40,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  emptyText: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
});

