import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, useColorScheme,
  Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGoals, Goals } from '@/hooks/useGoals';
import { Ionicons } from '@expo/vector-icons';

interface GoalField {
  key: keyof Goals;
  label: string;
  unit: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  description: string;
  min: number;
  max: number;
}

const GOAL_FIELDS: GoalField[] = [
  {
    key: 'steps',
    label: 'Daily Steps',
    unit: 'steps',
    icon: 'footsteps',
    color: '#6366f1',
    description: 'How many steps do you want to walk each day?',
    min: 1000,
    max: 50000,
  },
  {
    key: 'calories',
    label: 'Calories Burned',
    unit: 'kcal',
    icon: 'flame',
    color: '#f59e0b',
    description: 'Target calories to burn through exercise.',
    min: 100,
    max: 5000,
  },
  {
    key: 'workouts',
    label: 'Workout Sessions',
    unit: 'sessions',
    icon: 'barbell',
    color: '#8b5cf6',
    description: 'Number of workout sessions per day.',
    min: 1,
    max: 10,
  },
  {
    key: 'sleep',
    label: 'Sleep Duration',
    unit: 'hours',
    icon: 'moon',
    color: '#3b82f6',
    description: 'Target hours of sleep per night.',
    min: 4,
    max: 12,
  },
];

export default function GoalsScreen() {
  const isDark = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets();
  const { goals, loading, saveGoals, resetGoals } = useGoals();

  // Local draft state so user can edit without immediately saving
  const [draft, setDraft] = useState<Record<keyof Goals, string>>({
    steps: '',
    calories: '',
    workouts: '',
    sleep: '',
  });
  const [focusedKey, setFocusedKey] = useState<keyof Goals | null>(null);
  const [dirty, setDirty] = useState(false);

  // Initialise draft once goals load
  useEffect(() => {
    if (!loading) {
      setDraft({
        steps: String(goals.steps),
        calories: String(goals.calories),
        workouts: String(goals.workouts),
        sleep: String(goals.sleep),
      });
    }
  }, [loading, goals]);

  const handleChange = (key: keyof Goals, val: string) => {
    setDraft(prev => ({ ...prev, [key]: val }));
    setDirty(true);
  };

  const handleSave = async () => {
    // Validate all fields
    const errors: string[] = [];
    const parsed: Partial<Goals> = {};

    for (const field of GOAL_FIELDS) {
      const n = Number(draft[field.key]);
      if (isNaN(n) || n < field.min || n > field.max) {
        errors.push(`${field.label}: must be between ${field.min} and ${field.max}`);
      } else {
        parsed[field.key] = n;
      }
    }

    if (errors.length) {
      Alert.alert('Invalid Values', errors.join('\n'));
      return;
    }

    await saveGoals(parsed as Goals);
    setDirty(false);
    Alert.alert('Goals Saved ✓', 'Your daily goals have been updated.');
  };

  const handleReset = () => {
    Alert.alert('Reset Goals', 'Restore all goals to their defaults?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset', style: 'destructive',
        onPress: async () => {
          await resetGoals();
          setDirty(false);
        },
      },
    ]);
  };

  // ── Palette ────────────────────────────────────────────────────────────
  const bg   = isDark ? '#0d1117' : '#f0f4ff';
  const card = isDark ? '#1c2333' : '#ffffff';
  const text = isDark ? '#f1f5f9' : '#0f172a';
  const sub  = isDark ? '#64748b' : '#94a3b8';
  const surf = isDark ? '#252d3d' : '#f8faff';
  const ph   = isDark ? '#4b5563' : '#94a3b8';

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: bg },
    header: {
      paddingHorizontal: 24, paddingTop: 20, paddingBottom: 20,
      backgroundColor: isDark ? '#3b0764' : '#8b5cf6',
    },
    headerTitle: { fontSize: 26, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
    headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
    page: { padding: 20, paddingBottom: 40 },
    goalCard: {
      backgroundColor: card, borderRadius: 22, padding: 20,
      marginBottom: 16,
      shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 12 },
    iconBadge: {
      width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center',
    },
    cardLabel: { fontSize: 15, fontWeight: '700', color: text, flex: 1 },
    cardDesc: { fontSize: 12, color: sub, marginBottom: 14, lineHeight: 18 },
    inputRow: {
      flexDirection: 'row', alignItems: 'center', backgroundColor: surf,
      borderRadius: 14, borderWidth: 1.5, paddingHorizontal: 14,
    },
    inputField: { flex: 1, paddingVertical: 13, fontSize: 18, fontWeight: '700', color: text },
    inputUnit: { fontSize: 13, fontWeight: '600', color: sub },
    rangeHint: { fontSize: 11, color: sub, marginTop: 6, marginLeft: 2 },
    saveBtn: {
      backgroundColor: '#6366f1', borderRadius: 16, paddingVertical: 16,
      alignItems: 'center', marginBottom: 12, marginTop: 8,
      shadowColor: '#6366f1', shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35, shadowRadius: 10, elevation: 6,
    },
    saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    resetBtn: {
      borderRadius: 16, paddingVertical: 14, alignItems: 'center',
      borderWidth: 1.5, borderColor: isDark ? '#374151' : '#e2e8f0',
    },
    resetBtnText: { color: sub, fontSize: 15, fontWeight: '600' },
    dirtyBanner: {
      flexDirection: 'row', alignItems: 'center', gap: 8,
      backgroundColor: isDark ? '#1e1b4b' : '#eef2ff',
      borderRadius: 14, padding: 12, marginBottom: 16,
    },
    dirtyText: { flex: 1, fontSize: 13, color: '#6366f1', fontWeight: '600' },
  });

  if (loading) return null;

  return (
    <View style={s.container}>
      <View style={[s.header, { paddingTop: insets.top + 16 }]}>
        <Text style={s.headerTitle}>Daily Goals</Text>
        <Text style={s.headerSub}>Set your personal fitness targets</Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={s.page} showsVerticalScrollIndicator={false}>

          {/* Unsaved changes banner */}
          {dirty && (
            <View style={s.dirtyBanner}>
              <Ionicons name="information-circle" size={18} color="#6366f1" />
              <Text style={s.dirtyText}>You have unsaved changes</Text>
            </View>
          )}

          {GOAL_FIELDS.map(field => {
            const isFocused = focusedKey === field.key;
            return (
              <View key={field.key} style={[s.goalCard, { shadowColor: field.color }]}>
                <View style={s.cardHeader}>
                  <View style={[s.iconBadge, { backgroundColor: field.color + '22' }]}>
                    <Ionicons name={field.icon} size={20} color={field.color} />
                  </View>
                  <Text style={s.cardLabel}>{field.label}</Text>
                </View>
                <Text style={s.cardDesc}>{field.description}</Text>
                <View style={[
                  s.inputRow,
                  { borderColor: isFocused ? field.color : (isDark ? '#2e3a50' : '#e2e8f0') },
                ]}>
                  <TextInput
                    value={draft[field.key]}
                    onChangeText={v => handleChange(field.key, v)}
                    keyboardType="numeric"
                    style={[s.inputField, isFocused && { color: field.color }]}
                    onFocus={() => setFocusedKey(field.key)}
                    onBlur={() => setFocusedKey(null)}
                    selectTextOnFocus
                  />
                  <Text style={s.inputUnit}>{field.unit}</Text>
                </View>
                <Text style={s.rangeHint}>
                  Range: {field.min.toLocaleString()} – {field.max.toLocaleString()} {field.unit}
                </Text>
              </View>
            );
          })}

          <TouchableOpacity style={s.saveBtn} onPress={handleSave} activeOpacity={0.85}>
            <Text style={s.saveBtnText}>Save Goals</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.resetBtn} onPress={handleReset} activeOpacity={0.75}>
            <Text style={s.resetBtnText}>Reset to Defaults</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
