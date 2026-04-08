import React from 'react';
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
import StatTile from '@/components/StatTile';
import ChartBar from '@/components/ChartBar';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Per-activity-type display helpers ────────────────────────────────────
const ACTIVITY_META: Record<string, { icon: keyof typeof Ionicons.glyphMap; color: string }> = {
  steps:    { icon: 'footsteps',  color: '#6366f1' },
  workout:  { icon: 'barbell',    color: '#8b5cf6' },
  calories: { icon: 'flame',      color: '#f59e0b' },
  weight:   { icon: 'scale',      color: '#10b981' },
  sleep:    { icon: 'moon',       color: '#3b82f6' },
};

export default function DashboardScreen() {
  const isDark = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets();
  const { activities, loading }  = useActivities();
  const { goals }                = useGoals();
  const { weeklyData, loading: chartLoading } = useWeeklySteps(goals.steps);

  // ── Palette ──────────────────────────────────────────────────────────────
  const bg      = isDark ? '#0d1117' : '#f0f4ff';
  const card    = isDark ? '#1c2333' : '#ffffff';
  const textPri = isDark ? '#f1f5f9' : '#0f172a';
  const textSub = isDark ? '#64748b' : '#94a3b8';
  const border  = isDark ? '#1e293b' : '#e2e8f0';
  const accentBg = isDark ? '#1e1b4b' : '#eef2ff';

  // ── Today's totals ───────────────────────────────────────────────────────
  const totalSteps    = activities.filter(a => a.type === 'steps').reduce((s, a) => s + a.value, 0);
  const totalCalories = activities.filter(a => a.type === 'calories').reduce((s, a) => s + a.value, 0);
  const workouts      = activities.filter(a => a.type === 'workout').length;
  const avgSleep      = (() => {
    const sleepActs = activities.filter(a => a.type === 'sleep');
    if (!sleepActs.length) return 0;
    return sleepActs.reduce((s, a) => s + a.value, 0) / sleepActs.length;
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
        <View style={[s.heroCard, { backgroundColor: isDark ? '#1e1b4b' : '#6366f1', paddingTop: insets.top + 20 }]}>
          <View style={s.decCircle1} />
          <View style={s.decCircle2} />
          <View style={s.heroContent}>
            <View style={{ flex: 1 }}>
              <Text style={s.heroLabel}>{today}</Text>
              <Text style={s.heroTitle}>Today's{'\n'}Progress</Text>
              <View style={s.heroBadge}>
                <Ionicons name="trending-up" size={14} color="#ffffff" />
                <Text style={s.heroBadgeText}>Keep it up!</Text>
              </View>
            </View>
            <Link href="/log" asChild>
              <TouchableOpacity style={s.heroFab} activeOpacity={0.8}>
                <Ionicons name="add" size={28} color="#6366f1" />
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        <View style={s.page}>

          {/* ── Stats Grid ────────────────────────────────────────────── */}
          <Text style={[s.sectionTitle, { color: textPri }]}>Today's Stats</Text>
          <View style={s.statsGrid}>
            <StatTile
              title="Steps"
              value={totalSteps.toLocaleString()}
              subtitle={`of ${goals.steps.toLocaleString()} goal`}
              icon="footsteps"
              accentColor="#6366f1"
            />
            <StatTile
              title="Calories"
              value={String(totalCalories)}
              subtitle={`of ${goals.calories} kcal goal`}
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
          </View>

          {/* ── Weekly Chart ──────────────────────────────────────────── */}
          <View style={[s.sectionCard, { backgroundColor: card, shadowColor: isDark ? '#000' : '#6366f1' }]}>
            <View style={s.sectionCardHeader}>
              <View>
                <Text style={[s.sectionTitleInline, { color: textPri }]}>Weekly Steps</Text>
                <Text style={[s.sectionSubtitle, { color: textSub }]}>Last 7 days</Text>
              </View>
              {!chartLoading && (
                <View style={[s.badge, { backgroundColor: accentBg }]}>
                  <Ionicons name="bar-chart" size={13} color="#6366f1" />
                  <Text style={s.badgeText}>
                    {weeklyData.reduce((s, d) => s + d.value, 0).toLocaleString()} steps
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
          <View style={s.rowHeader}>
            <Text style={[s.sectionTitleInline, { color: textPri }]}>Recent Log</Text>
            <Link href="/log" asChild>
              <TouchableOpacity>
                <Text style={{ color: '#6366f1', fontSize: 13, fontWeight: '700' }}>+ Add</Text>
              </TouchableOpacity>
            </Link>
          </View>

          {activities.length === 0 ? (
            <View style={[s.emptyCard, { backgroundColor: card, borderColor: border }]}>
              <View style={[s.emptyIcon, { backgroundColor: accentBg }]}>
                <Ionicons name="fitness" size={28} color="#6366f1" />
              </View>
              <Text style={[s.emptyTitle, { color: textPri }]}>No activities yet</Text>
              <Text style={[s.emptySubtitle, { color: textSub }]}>
                Tap the + button to log your first activity today.
              </Text>
            </View>
          ) : (
            activities.slice(0, 5).map((act) => {
              const meta = ACTIVITY_META[act.type] ?? { icon: 'ellipse' as const, color: '#6b7280' };
              return (
                <View
                  key={act.id}
                  style={[s.logItem, { backgroundColor: card, borderColor: border, shadowColor: meta.color }]}
                >
                  <View style={[s.logIconWrap, { backgroundColor: meta.color + '22' }]}>
                    <Ionicons name={meta.icon} size={20} color={meta.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[s.logTitle, { color: textPri }]}>
                      {act.type.charAt(0).toUpperCase() + act.type.slice(1)}
                    </Text>
                    <Text style={[s.logValue, { color: meta.color }]}>
                      {act.value} {act.unit}
                    </Text>
                    {act.notes ? (
                      <Text style={[s.logNote, { color: textSub }]} numberOfLines={1}>{act.notes}</Text>
                    ) : null}
                  </View>
                  <Text style={[s.logDate, { color: textSub }]}>
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
const s = StyleSheet.create({
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
});
