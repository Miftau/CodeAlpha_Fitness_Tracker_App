import React, { useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useActivities, useWeeklySteps } from '@/hooks/useActivities';
import { useGoals } from '@/hooks/useGoals';
import { useWorkoutScheduler } from '@/hooks/useWorkoutScheduler';
import StatTile from '@/components/StatTile';
import ChartBar from '@/components/ChartBar';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Per-activity-type display helpers ────────────────────────────────────
const ACTIVITY_META: Record<string, { icon: keyof typeof Ionicons.glyphMap; color: string }> = {
  steps:    { icon: 'footsteps',  color: '#6366f1' },
  workout:  { icon: 'barbell',    color: '#8b5cf6' },
  distance: { icon: 'map',        color: '#8b5cf6' },
};

const QUICK_ACTIONS = [
  { label: 'Auto Tracker', icon: 'pulse' as const,    href: '/tracker'   as const, color: '#8b5cf6' },
  { label: 'Workout Timer', icon: 'timer' as const,   href: '/timer'     as const, color: '#f59e0b' },
  { label: 'Schedule',      icon: 'calendar' as const, href: '/schedule'  as const, color: '#10b981' },
  { label: 'Activity Log',  icon: 'create' as const,  href: '/log'       as const, color: '#3b82f6' },
] as const;

export default function DashboardScreen() {
  const isDark = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets();
  const { activities, loading, refetch }  = useActivities();
  const { goals }                = useGoals();
  const { weeklyData, loading: chartLoading, refetch: refetchWeekly } = useWeeklySteps(goals.steps);
  const { scheduledWorkouts, refetch: refetchSchedules } = useWorkoutScheduler();

  // Refresh data explicitly every time the user tabs back here
  useFocusEffect(
    useCallback(() => {
      if (refetch) refetch();
      if (refetchWeekly) refetchWeekly();
      if (refetchSchedules) refetchSchedules();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );

  // ── Palette ──────────────────────────────────────────────────────────────
  const bg      = isDark ? '#0d1117' : '#f0f4ff';
  const card    = isDark ? '#1c2333' : '#ffffff';
  const textPri = isDark ? '#f1f5f9' : '#0f172a';
  const textSub = isDark ? '#64748b' : '#94a3b8';
  const border  = isDark ? '#1e293b' : '#e2e8f0';
  const accentBg = isDark ? '#1e1b4b' : '#eef2ff';

  // ── Today's totals ───────────────────────────────────────────────────────
  const totalSteps    = activities.filter(a => a.type === 'steps').reduce((sum, a) => sum + a.value, 0);
  const totalCalories = activities.filter(a => a.type === 'calories').reduce((sum, a) => sum + a.value, 0);
  const totalDistance = activities.filter(a => a.type === 'distance').reduce((sum, a) => sum + a.value, 0);
  const workouts      = activities.filter(a => a.type === 'workout').length;
  const avgSleep      = (() => {
    const sleepActs = activities.filter(a => a.type === 'sleep');
    if (!sleepActs.length) return 0;
    return sleepActs.reduce((sum, a) => sum + a.value, 0) / sleepActs.length;
  })();

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });

  // ── Loading screen ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: bg, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={{ marginTop: 16, fontSize: 15, color: textSub, fontWeight: '500' }}>
          Loading your stats…
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* ── Hero Header ─────────────────────────────────────────────── */}
        <View style={[styles.heroCard, { backgroundColor: isDark ? '#1e1b4b' : '#6366f1', paddingTop: insets.top + 20 }]}>
          <View style={styles.decCircle1} />
          <View style={styles.decCircle2} />
          <View style={styles.heroContent}>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroLabel}>{today}</Text>
              <Text style={styles.heroTitle}>Today's{'\n'}Progress</Text>
              <View style={styles.heroBadge}>
                <Ionicons name="trending-up" size={14} color="#ffffff" />
                <Text style={styles.heroBadgeText}>Keep it up!</Text>
              </View>
            </View>
            <Link href="/log" asChild>
              <TouchableOpacity style={styles.heroFab} activeOpacity={0.8}>
                <Ionicons name="add" size={28} color="#6366f1" />
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        <View style={styles.page}>

          {/* ── Stats Grid ────────────────────────────────────────────── */}
          <Text style={[styles.sectionTitle, { color: textPri }]}>Today's Stats</Text>
          <View style={styles.statsGrid}>
            <StatTile
              title="Steps"
              value={totalSteps.toLocaleString()}
              subtitle={`of ${goals.steps.toLocaleString()} goal`}
              icon="footsteps"
              accentColor="#6366f1"
            />
            <StatTile
              title="Calories"
              value={totalCalories ? `${totalCalories.toFixed(1)}` : '0'}
              subtitle="Cal burned today"
              icon="flame"
              accentColor="#f59e0b"
            />
            <StatTile
              title="Workouts"
              value={String(workouts)}
              subtitle={`of ${goals.workouts} goal`}
              icon="barbell"
              accentColor="#8b5cf6"
            />
            <StatTile
              title="Sleep"
              value={avgSleep ? `${avgSleep.toFixed(1)}h` : '—'}
              subtitle={`goal: ${goals.sleep}h`}
              icon="moon"
              accentColor="#3b82f6"
            />
            <StatTile
              title="Distance"
              value={`${totalDistance.toFixed(2)}`}
              subtitle="km covered"
              icon="map"
              accentColor="#8b5cf6"
            />
          </View>

          {/* ── Quick Actions Grid ────────────────────────────────────── */}
          <Text style={[styles.sectionTitle, { color: textPri, marginBottom: 12 }]}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {QUICK_ACTIONS.map(({ label, icon, href, color }) => (
              <Link key={label} href={href} asChild>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    styles.actionCard,
                    { backgroundColor: card, shadowColor: color },
                  ]}
                >
                  <View style={[styles.actionIconWrap, { backgroundColor: color + (isDark ? '33' : '1a') }]}>
                    <Ionicons name={icon} size={22} color={color} />
                  </View>
                  <Text style={[styles.actionLabel, { color: textPri }]}>{label}</Text>
                  <Ionicons name="chevron-forward" size={14} color={textSub} style={{ marginTop: 'auto' }} />
                </TouchableOpacity>
              </Link>
            ))}
          </View>

          {/* ── Next Workout Preview ───────────────────────────────────── */}
          {(() => {
            const upcoming = scheduledWorkouts
              .filter(w => !w.completed && new Date(w.scheduledTime) > new Date())
              .sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime())[0];
            
            if (!upcoming) return null;

            return (
              <Link href="/schedule" asChild>
                <TouchableOpacity activeOpacity={0.9}>
                  <View style={[styles.sectionCard, { backgroundColor: card, shadowColor: isDark ? '#000' : '#6366f1', marginBottom: 28 }]}>
                    <View style={styles.sectionCardHeader}>
                      <View>
                        <Text style={[styles.sectionTitleInline, { color: textPri }]}>Up Next</Text>
                        <Text style={[styles.sectionSubtitle, { color: textSub }]}>Scheduled Workout</Text>
                      </View>
                      <View style={[styles.badge, { backgroundColor: isDark ? '#1e1b4b' : '#6366f1' + '15' }]}>
                        <Ionicons name="notifications" size={13} color="#6366f1" />
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                      <View style={[styles.logIconWrap, { backgroundColor: '#6366f1' + '22', marginRight: 12 }]}>
                        <Ionicons name="time" size={22} color="#6366f1" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.logTitle, { color: textPri, fontSize: 16 }]}>{upcoming.title}</Text>
                        <Text style={[styles.logValue, { color: '#6366f1' }]}>
                          {new Date(upcoming.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(upcoming.scheduledTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color={textSub} />
                    </View>
                  </View>
                </TouchableOpacity>
              </Link>
            );
          })()}

          {/* ── Weekly Chart ──────────────────────────────────────────── */}
          <View style={[styles.sectionCard, { backgroundColor: card, shadowColor: isDark ? '#000' : '#6366f1' }]}>
            <View style={styles.sectionCardHeader}>
              <View>
                <Text style={[styles.sectionTitleInline, { color: textPri }]}>Weekly Steps</Text>
                <Text style={[styles.sectionSubtitle, { color: textSub }]}>Last 7 days</Text>
              </View>
              {!chartLoading && (
                <View style={[styles.badge, { backgroundColor: accentBg }]}>
                  <Ionicons name="bar-chart" size={13} color="#6366f1" />
                  <Text style={styles.badgeText}>
                    {weeklyData.reduce((acc: number, d) => acc + d.value, 0).toLocaleString()} steps
                  </Text>
                </View>
              )}
            </View>
            {chartLoading ? (
              <View style={{ height: 150, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator color="#6366f1" />
                <Text style={{ color: textSub, marginTop: 8, fontSize: 13 }}>Loading chart…</Text>
              </View>
            ) : (
              <ChartBar data={weeklyData} height={150} width={SCREEN_WIDTH - 80} />
            )}
          </View>

          {/* ── Recent Log Header ─────────────────────────────────────── */}
          <View style={styles.rowHeader}>
            <Text style={[styles.sectionTitleInline, { color: textPri }]}>Recent Log</Text>
            <Link href="/log" asChild>
              <TouchableOpacity>
                <Text style={{ color: '#6366f1', fontSize: 13, fontWeight: '700' }}>+ Add</Text>
              </TouchableOpacity>
            </Link>
          </View>

          {activities.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: card, borderColor: border }]}>
              <View style={[styles.emptyIcon, { backgroundColor: accentBg }]}>
                <Ionicons name="fitness" size={28} color="#6366f1" />
              </View>
              <Text style={[styles.emptyTitle, { color: textPri }]}>No activities yet</Text>
              <Text style={[styles.emptySubtitle, { color: textSub }]}>
                Tap the + button to log your first activity today.
              </Text>
            </View>
          ) : (
            activities.slice(0, 5).map((act) => {
              const meta = ACTIVITY_META[act.type] ?? { icon: 'ellipse' as const, color: '#6b7280' };
              return (
                <View
                  key={act.id}
                  style={[styles.logItem, { backgroundColor: card, borderColor: border, shadowColor: meta.color }]}
                >
                  <View style={[styles.logIconWrap, { backgroundColor: meta.color + '22' }]}>
                    <Ionicons name={meta.icon} size={20} color={meta.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.logTitle, { color: textPri }]}>
                      {act.type.charAt(0).toUpperCase() + act.type.slice(1)}
                    </Text>
                    <Text style={[styles.logValue, { color: meta.color }]}>
                      {act.value} {act.unit}
                    </Text>
                    {act.notes ? (
                      <Text style={[styles.logNote, { color: textSub }]} numberOfLines={1}>{act.notes}</Text>
                    ) : null}
                  </View>
                  <Text style={[styles.logDate, { color: textSub }]}>
                    {new Date(act.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </Text>
                </View>
              );
            })
          )}

        </View>
      </ScrollView>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  heroCard: {
    paddingTop: 32, paddingBottom: 36, paddingHorizontal: 24, overflow: 'hidden',
  },
  decCircle1: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.07)', top: -60, right: -40,
  },
  decCircle2: {
    position: 'absolute', width: 130, height: 130, borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.05)', bottom: -40, left: 20,
  },
  heroContent: { flexDirection: 'row', alignItems: 'flex-start' },
  heroLabel: {
    fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: '600',
    letterSpacing: 0.5, marginBottom: 6, textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: 34, fontWeight: '800', color: '#ffffff', letterSpacing: -1, lineHeight: 40,
  },
  heroBadge: {
    flexDirection: 'row', alignItems: 'center', marginTop: 14,
    backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 5, alignSelf: 'flex-start', gap: 5,
  },
  heroBadgeText: { color: '#ffffff', fontSize: 12, fontWeight: '600' },
  heroFab: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: '#ffffff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2, shadowRadius: 10, elevation: 8, marginTop: 4,
  },
  page: { paddingHorizontal: 20, paddingTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 14, letterSpacing: -0.3 },
  sectionTitleInline: { fontSize: 16, fontWeight: '700', letterSpacing: -0.3 },
  sectionSubtitle: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginBottom: 28 },
  sectionCard: {
    borderRadius: 22, padding: 20, marginBottom: 28,
    shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 5,
  },
  sectionCardHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18,
  },
  badge: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 5, gap: 5,
  },
  badgeText: { fontSize: 12, fontWeight: '700', color: '#6366f1' },
  rowHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12,
  },
  logItem: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 18, padding: 16,
    marginBottom: 10, borderWidth: 1,
    shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 3, gap: 14,
  },
  logIconWrap: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  logTitle: { fontSize: 14, fontWeight: '700', letterSpacing: -0.2 },
  logValue: { fontSize: 13, fontWeight: '600', marginTop: 2 },
  logNote: { fontSize: 12, marginTop: 2 },
  logDate: { fontSize: 11, fontWeight: '500', textAlign: 'right' },
  emptyCard: { borderRadius: 22, padding: 32, borderWidth: 1, alignItems: 'center', marginBottom: 16 },
  emptyIcon: { width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emptyTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  emptySubtitle: { fontSize: 13, textAlign: 'center', lineHeight: 20 },
  
  // Quick Actions Styles
  actionsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 28,
  },
  actionCard: {
    width: (SCREEN_WIDTH - 52) / 2, borderRadius: 18, padding: 16,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 4,
    flexDirection: 'column', gap: 8,
  },
  actionIconWrap: {
    width: 42, height: 42, borderRadius: 13,
    alignItems: 'center', justifyContent: 'center',
  },
  actionLabel: { fontSize: 13, fontWeight: '700', letterSpacing: -0.2 },
});
