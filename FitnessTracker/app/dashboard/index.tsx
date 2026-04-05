import React from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, useColorScheme, TouchableOpacity } from 'react-native';
import { useActivities } from '@/hooks/useActivities';
import StatTile from '@/components/StatTile';
import ChartBar from '@/components/ChartBar';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';




const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: '#e5e7eb',
    borderTopColor: '#3b82f6',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: '500',
    marginBottom: 12,
  },
  activityContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  activityTitle: {
    fontWeight: '500',
  },
  activityNote: {
    fontSize: 14,
    marginTop: 4,
  },
  activityDate: {
    fontSize: 12,
    marginTop: 8,
  },
  emptyContainer: {
    padding: 16,
    borderRadius: 8,
  },
  emptyText: {
    textAlign: 'center',
  },
  chartsContainer: {
    marginBottom: 24,
  },
});

export default function DashboardScreen() {
  const isDark = useColorScheme() === 'dark';
  const { activities, loading, error } = useActivities();

  // Mock weekly data for demo
  const weeklyData = [
    { label: 'Mon', value: 8200, max: 10000 },
    { label: 'Tue', value: 9500, max: 10000 },
    { label: 'Wed', value: 7100, max: 10000 },
    { label: 'Thu', value: 10200, max: 10000 },
    { label: 'Fri', value: 8800, max: 10000 },
    { label: 'Sat', value: 12000, max: 10000 },
    { label: 'Sun', value: 6500, max: 10000 },
  ];

  const totalSteps = activities.filter(a => a.type === 'steps').reduce((sum, a) => sum + a.value, 0);
  const totalCalories = activities.filter(a => a.type === 'calories').reduce((sum, a) => sum + a.value, 0);
  const workouts = activities.filter(a => a.type === 'workout').length;

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#111827' : '#f9fafb' }]}>
        <View style={styles.centerContainer}>
          <View style={styles.spinner} />
          <Text style={[styles.loadingText, { color: isDark ? '#d1d5db' : '#374151' }]}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#111827' : '#f9fafb' }}>
      <ScrollView style={{ padding: 16 }}>
        <View style={{ marginBottom: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: isDark ? '#ffffff' : '#111827'
          }}>
            Today&apos;s Progress
          </Text>
          <Link href="/log" asChild>
            <TouchableOpacity style={{
              padding: 12,
              borderRadius: 24,
              backgroundColor: isDark ? '#2563eb' : '#3b82f6'
            }}>
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </Link>
        </View>

        {/* Stats Grid */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
          <StatTile title="Steps" value={totalSteps.toLocaleString()} subtitle="of 10,000" />
          <StatTile title="Calories" value={`${totalCalories} kcal`} subtitle="burned" />
          <StatTile title="Workouts" value={workouts.toString()} subtitle="today" />
          <StatTile title="Avg Sleep" value="7.2h" subtitle="last 7 days" />
        </View>

        {/* Weekly Steps Chart */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{
            fontWeight: '500',
            marginBottom: 12,
            color: isDark ? '#ffffff' : '#111827'
          }}>
            Weekly Steps
          </Text>
          <ChartBar data={weeklyData} height={140} width={300} />
        </View>

        {/* Recent Activities */}
        <View>
          <Text style={{
            fontWeight: '500',
            marginBottom: 12,
            color: isDark ? '#ffffff' : '#111827'
          }}>
            Recent Log
          </Text>
          {activities.length === 0 ? (
            <View style={{
              padding: 16,
              borderRadius: 8,
              backgroundColor: isDark ? '#1f2937' : '#ffffff'
            }}>
              <Text style={{
                textAlign: 'center',
                color: isDark ? '#9ca3af' : '#6b7280'
              }}>
                No activities logged yet. Tap “+” to add!
              </Text>
            </View>
          ) : (
            activities.map((act) => (
              <View
                key={act.id}
                style={[styles.activityContainer, { backgroundColor: isDark ? '#1f2937' : '#ffffff' }]}
              >
                <Text style={[styles.activityTitle, { color: isDark ? '#ffffff' : '#111827' }]}>
                  {act.type.charAt(0).toUpperCase() + act.type.slice(1)}: {act.value} {act.unit}
                </Text>
                {act.notes && (
                  <Text style={[styles.activityNote, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                    {act.notes}
                  </Text>
                )}
                <Text style={[styles.activityDate, { color: isDark ? '#6b7280' : '#9ca3af' }]}>
                  {new Date(act.date).toLocaleDateString()}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}