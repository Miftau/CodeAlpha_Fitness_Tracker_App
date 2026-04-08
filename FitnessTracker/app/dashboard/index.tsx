import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useActivities } from '@/hooks/useActivities';
import StatTile from '@/components/StatTile';
import ChartBar from '@/components/ChartBar';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Quick-action card data ────────────────────────────────────────────────
const QUICK_ACTIONS = [
  { label: 'Auto Tracker', icon: 'pulse' as const,    href: './tracker'  as const, color: '#8b5cf6' },
  { label: 'Workout Timer', icon: 'timer' as const,   href: './timer'    as const, color: '#f59e0b' },
  { label: 'Schedule',      icon: 'calendar' as const, href: './schedule' as const, color: '#10b981' },
  { label: 'Health Sync',   icon: 'heart' as const,   href: './health'   as const, color: '#ec4899' },
  { label: 'Log Activity',  icon: 'create' as const,  href: '/log'       as const, color: '#3b82f6' },
] as const;

// ─── Per-activity-type display helpers ────────────────────────────────────
const ACTIVITY_META: Record<string, { icon: keyof typeof Ionicons.glyphMap; color: string }> = {
  steps:    { icon: 'footsteps',    color: '#6366f1' },
  workout:  { icon: 'barbell',      color: '#8b5cf6' },
  calories: { icon: 'flame',        color: '#f59e0b' },
  weight:   { icon: 'scale',        color: '#10b981' },
  sleep:    { icon: 'moon',         color: '#3b82f6' },
};

export default function DashboardScreen() {
  const isDark = useColorScheme() === 'dark';
  const { activities, loading } = useActivities();

  // ── Palette ──────────────────────────────────────────────────────────────
  const bg       = isDark ? '#0d1117' : '#f0f4ff';
  const card     = isDark ? '#1c2333' : '#ffffff';
  const surface  = isDark ? '#252d3d' : '#f8faff';
  const textPri  = isDark ? '#f1f5f9' : '#0f172a';
  const textSub  = isDark ? '#64748b' : '#94a3b8';
  const border   = isDark ? '#1e293b' : '#e2e8f0';
  const accentBg = isDark ? '#1e1b4b' : '#eef2ff';

  // ── Derived stats ────────────────────────────────────────────────────────
  const totalSteps    = activities.filter(a => a.type === 'steps').reduce((s, a) => s + a.value, 0);
  const totalCalories = activities.filter(a => a.type === 'calories').reduce((s, a) => s + a.value, 0);
  const workouts      = activities.filter(a => a.type === 'workout').length;

  // Mock weekly chart data
  const weeklyData = [
    { label: 'Mon', value: 8200,  max: 12000 },
    { label: 'Tue', value: 9500,  max: 12000 },
    { label: 'Wed', value: 7100,  max: 12000 },
    { label: 'Thu', value: 10200, max: 12000 },
    { label: 'Fri', value: 8800,  max: 12000 },
    { label: 'Sat', value: 12000, max: 12000 },
    { label: 'Sun', value: 6500,  max: 12000 },
  ];

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: bg, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{
          width: 56, height: 56, borderRadius: 28,
          borderWidth: 4, borderColor: border, borderTopColor: '#6366f1',
        }} />
        <Text style={{ marginTop: 16, fontSize: 15, color: textSub, fontWeight: '500' }}>
          Loading your stats…
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Hero Header ─────────────────────────────────────────────── */}
        <View style={[styles.heroCard, { backgroundColor: isDark ? '#1e1b4b' : '#6366f1' }]}>
          {/* Decorative circles */}
          <View style={styles.decCircle1} />
          <View style={styles.decCircle2} />

          <View style={styles.heroContent}>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroLabel}>Today · {today}</Text>
              <Text style={styles.heroTitle}>Today's{'\n'}Progress</Text>
              <View style={styles.heroBadge}>
                <Ionicons name="trending-up" size={14} color="#ffffff" />
                <Text style={styles.heroBadgeText}>Great pace!</Text>
              </View>
            </View>
            <Link href="/log" asChild>
              <TouchableOpacity style={styles.heroFab} activeOpacity={0.8}>
                <Ionicons name="add" size={28} color="#6366f1" />
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        <View style={styles.pageContent}>

          {/* ── Stats Grid ────────────────────────────────────────────── */}
          <Text style={[styles.sectionHeading, { color: textPri }]}>Today's Stats</Text>
          <View style={styles.statsGrid}>
            <StatTile
              title="Steps"
              value={totalSteps.toLocaleString() || '0'}
              subtitle="of 10,000 goal"
              icon="footsteps"
              accentColor="#6366f1"
            />
            <StatTile
              title="Calories"
              value={totalCalories ? `${totalCalories}` : '0'}
              subtitle="kcal burned"
              icon="flame"
              accentColor="#f59e0b"
            />
            <StatTile
              title="Workouts"
              value={workouts.toString()}
              subtitle="sessions today"
              icon="barbell"
              accentColor="#8b5cf6"
            />
            <StatTile
              title="Sleep"
              value="7.2h"
              subtitle="last 7-day avg"
              icon="moon"
              accentColor="#3b82f6"
            />
          </View>

          {/* ── Quick Actions ─────────────────────────────────────────── */}
          <Text style={[styles.sectionHeading, { color: textPri }]}>Quick Actions</Text>
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

          {/* ── Weekly Chart ──────────────────────────────────────────── */}
          <View style={[styles.sectionCard, { backgroundColor: card, shadowColor: isDark ? '#000' : '#6366f1' }]}>
            <View style={styles.sectionCardHeader}>
              <View>
                <Text style={[styles.sectionHeadingInline, { color: textPri }]}>Weekly Steps</Text>
                <Text style={[styles.sectionSubtitle, { color: textSub }]}>Last 7 days overview</Text>
              </View>
              <View style={[styles.summaryBadge, { backgroundColor: accentBg }]}>
                <Ionicons name="bar-chart" size={14} color="#6366f1" />
                <Text style={styles.summaryBadgeText}>
                  {weeklyData.reduce((s, d) => s + d.value, 0).toLocaleString()} steps
                </Text>
              </View>
            </View>
            <ChartBar data={weeklyData} height={150} width={SCREEN_WIDTH - 80} />
          </View>

          {/* ── Recent Activity Log ───────────────────────────────────── */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionHeadingInline, { color: textPri }]}>Recent Log</Text>
            <Link href="/log" asChild>
              <TouchableOpacity>
                <Text style={{ color: '#6366f1', fontSize: 13, fontWeight: '600' }}>+ Add</Text>
              </TouchableOpacity>
            </Link>
          </View>

          {activities.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: card, borderColor: border }]}>
              <View style={[styles.emptyIconWrap, { backgroundColor: accentBg }]}>
                <Ionicons name="fitness" size={28} color="#6366f1" />
              </View>
              <Text style={[styles.emptyTitle, { color: textPri }]}>No activities yet</Text>
              <Text style={[styles.emptySubtitle, { color: textSub }]}>
                Tap the + button to log your first activity today.
              </Text>
            </View>
          ) : (
            activities.slice(0, 5).map((act) => {
              const meta = ACTIVITY_META[act.type] ?? { icon: 'ellipse', color: '#6b7280' };
              return (
                <View
                  key={act.id}
                  style={[styles.logItem, { backgroundColor: card, borderColor: border, shadowColor: isDark ? '#000' : meta.color }]}
                >
                  <View style={[styles.logIcon, { backgroundColor: meta.color + '22' }]}>
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
                      <Text style={[styles.logNote, { color: textSub }]} numberOfLines={1}>
                        {act.notes}
                      </Text>
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
    </SafeAreaView>
  );
}

// ─── Static styles ──────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // Hero
  heroCard: {
    marginHorizontal: 0,
    paddingTop: 32,
    paddingBottom: 36,
    paddingHorizontal: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  decCircle1: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.07)', top: -60, right: -40,
  },
  decCircle2: {
    position: 'absolute', width: 130, height: 130, borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.05)', bottom: -40, left: 20,
  },
  heroContent: {
    flexDirection: 'row', alignItems: 'flex-start',
  },
  heroLabel: {
    fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: '600',
    letterSpacing: 0.5, marginBottom: 6, textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: 34, fontWeight: '800', color: '#ffffff',
    letterSpacing: -1, lineHeight: 40,
  },
  heroBadge: {
    flexDirection: 'row', alignItems: 'center', marginTop: 14,
    backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 5, alignSelf: 'flex-start', gap: 5,
  },
  heroBadgeText: { color: '#ffffff', fontSize: 12, fontWeight: '600' },
  heroFab: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2, shadowRadius: 10, elevation: 8, marginTop: 4,
  },

  // Page
  pageContent: { paddingHorizontal: 20, paddingTop: 24 },

  // Section headings
  sectionHeading: {
    fontSize: 18, fontWeight: '700', marginBottom: 14, letterSpacing: -0.3,
  },
  sectionHeadingInline: {
    fontSize: 16, fontWeight: '700', letterSpacing: -0.3,
  },
  sectionSubtitle: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 12, marginTop: 8,
  },

  // Stats grid
  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginBottom: 28,
  },

  // Quick Actions
  actionsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 28,
  },
  actionCard: {
    width: '46%', borderRadius: 18, padding: 16,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 4,
    flexDirection: 'column', gap: 8,
  },
  actionIconWrap: {
    width: 42, height: 42, borderRadius: 13,
    alignItems: 'center', justifyContent: 'center',
  },
  actionLabel: { fontSize: 13, fontWeight: '700', letterSpacing: -0.2 },

  // Chart section card
  sectionCard: {
    borderRadius: 22, padding: 20, marginBottom: 28,
    shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 5,
  },
  sectionCardHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 18,
  },
  summaryBadge: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 5, gap: 5,
  },
  summaryBadgeText: { fontSize: 12, fontWeight: '700', color: '#6366f1' },

  // Activity log
  logItem: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 18,
    padding: 16, marginBottom: 10, borderWidth: 1,
    shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
    gap: 14,
  },
  logIcon: {
    width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center',
  },
  logTitle: { fontSize: 14, fontWeight: '700', letterSpacing: -0.2 },
  logValue: { fontSize: 13, fontWeight: '600', marginTop: 2 },
  logNote: { fontSize: 12, marginTop: 2 },
  logDate: { fontSize: 11, fontWeight: '500', textAlign: 'right' },

  // Empty state
  emptyCard: {
    borderRadius: 22, padding: 32, borderWidth: 1,
    alignItems: 'center', marginBottom: 16,
  },
  emptyIconWrap: {
    width: 64, height: 64, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  emptyTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  emptySubtitle: { fontSize: 13, textAlign: 'center', lineHeight: 20 },
});