import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, Alert, StyleSheet, useColorScheme,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useActivities } from '@/hooks/useActivities';
import { Ionicons } from '@expo/vector-icons';

const ACTIVITY_TYPES = [
  { label: 'Steps',    value: 'steps',    unit: 'steps',   icon: 'footsteps'  as const, color: '#6366f1' },
  { label: 'Workout',  value: 'workout',  unit: 'minutes', icon: 'barbell'    as const, color: '#8b5cf6' },
  { label: 'Calories', value: 'calories', unit: 'kcal',    icon: 'flame'      as const, color: '#f59e0b' },
  { label: 'Weight',   value: 'weight',   unit: 'kg',      icon: 'scale'      as const, color: '#10b981' },
  { label: 'Sleep',    value: 'sleep',    unit: 'hours',   icon: 'moon'       as const, color: '#3b82f6' },
];

export default function LogActivityScreen() {
  const isDark = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets();
  const { logActivity } = useActivities();

  const bg     = isDark ? '#0d1117' : '#f0f4ff';
  const card   = isDark ? '#1c2333' : '#ffffff';
  const text   = isDark ? '#f1f5f9' : '#0f172a';
  const sub    = isDark ? '#64748b' : '#94a3b8';
  const border = isDark ? '#2e3a50' : '#e2e8f0';
  const surf   = isDark ? '#252d3d' : '#f8faff';
  const ph     = isDark ? '#4b5563' : '#94a3b8';

  const [selectedType, setSelectedType] = useState(ACTIVITY_TYPES[0]);
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [focused, setFocused] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleTypeSelect = (typeValue: string) => {
    const t = ACTIVITY_TYPES.find(a => a.value === typeValue);
    if (t) setSelectedType(t);
  };

  const handleSubmit = async () => {
    if (!value || isNaN(Number(value)) || Number(value) <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid positive number.');
      return;
    }
    setSubmitting(true);
    try {
      await logActivity({
        type: selectedType.value as any,
        value: Number(value),
        unit: selectedType.unit,
        notes,
        date,
      });
      Alert.alert('✓ Logged!', `${selectedType.label} activity saved.`);
      setValue('');
      setNotes('');
    } catch {
      Alert.alert('Error', 'Failed to log activity. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: bg },
    header: {
      paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16,
      backgroundColor: isDark ? '#1e1b4b' : '#6366f1',
    },
    headerTitle: { fontSize: 26, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
    headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
    page: { padding: 20 },
    label: {
      fontSize: 11, fontWeight: '700', letterSpacing: 0.8,
      textTransform: 'uppercase', color: sub, marginBottom: 8, marginLeft: 2,
    },
    field: { marginBottom: 16 },
    typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    typeChip: {
      flexDirection: 'row', alignItems: 'center', paddingVertical: 10,
      paddingHorizontal: 14, borderRadius: 14, borderWidth: 1.5, gap: 6,
    },
    typeChipLabel: { fontSize: 13, fontWeight: '600' },
    inputWrap: {
      flexDirection: 'row', alignItems: 'center', backgroundColor: surf,
      borderRadius: 14, borderWidth: 1.5, paddingHorizontal: 14,
    },
    inputIcon: { marginRight: 10 },
    input: { flex: 1, paddingVertical: 13, fontSize: 16, color: text },
    dateBtn: {
      flexDirection: 'row', alignItems: 'center', backgroundColor: isDark ? '#1e3a5f' : '#dbeafe',
      borderRadius: 14, paddingVertical: 13, paddingHorizontal: 16,
    },
    dateBtnText: { fontSize: 14, fontWeight: '600', color: isDark ? '#93c5fd' : '#1d4ed8', marginLeft: 8 },
    notesWrap: {
      backgroundColor: surf, borderRadius: 14, borderWidth: 1.5,
      paddingHorizontal: 14, paddingTop: 12,
    },
    notes: { fontSize: 14, color: text, minHeight: 72, textAlignVertical: 'top' },
    submitBtn: {
      paddingVertical: 16, borderRadius: 16, alignItems: 'center',
      backgroundColor: submitting ? (isDark ? '#374151' : '#c7d2fe') : '#6366f1',
      shadowColor: '#6366f1', shadowOffset: { width: 0, height: 4 },
      shadowOpacity: submitting ? 0 : 0.35, shadowRadius: 10, elevation: submitting ? 0 : 6,
      marginTop: 8,
    },
    submitText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.headerTitle}>Log Activity</Text>
        <Text style={styles.headerSub}>Record today's fitness data</Text>
      </View>

      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>

        {/* Activity type chips */}
        <View style={styles.field}>
          <Text style={styles.label}>Activity Type</Text>
          <View style={styles.typeGrid}>
            {ACTIVITY_TYPES.map(t => {
              const active = t.value === selectedType.value;
              return (
                <TouchableOpacity
                  key={t.value}
                  onPress={() => handleTypeSelect(t.value)}
                  activeOpacity={0.75}
                  style={[
                    styles.typeChip,
                    {
                      borderColor: active ? t.color : border,
                      backgroundColor: active ? t.color + '22' : surf,
                    },
                  ]}
                >
                  <Ionicons name={t.icon} size={16} color={active ? t.color : sub} />
                  <Text style={[styles.typeChipLabel, { color: active ? t.color : sub }]}>{t.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Value input */}
        <View style={styles.field}>
          <Text style={styles.label}>
            {selectedType.label} ({selectedType.unit})
          </Text>
          <View style={[styles.inputWrap, { borderColor: focused ? selectedType.color : border }]}>
            <Ionicons
              name={selectedType.icon}
              size={18}
              color={focused ? selectedType.color : sub}
              style={styles.inputIcon}
            />
            <TextInput
              value={value}
              onChangeText={setValue}
              placeholder={`Enter ${selectedType.unit}`}
              placeholderTextColor={ph}
              keyboardType="numeric"
              style={styles.input}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
          </View>
        </View>

        {/* Date picker */}
        <View style={styles.field}>
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateBtn} activeOpacity={0.75}>
            <Ionicons name="calendar-outline" size={18} color={isDark ? '#93c5fd' : '#1d4ed8'} />
            <Text style={styles.dateBtnText}>
              {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={new Date(date)}
              mode="date"
              display="default"
              onChange={(_, d) => { setShowDatePicker(false); if (d) setDate(d.toISOString().split('T')[0]); }}
              maximumDate={new Date()}
            />
          )}
        </View>

        {/* Notes */}
        <View style={styles.field}>
          <Text style={styles.label}>Notes (optional)</Text>
          <View style={[styles.notesWrap, { borderColor: border }]}>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Add a note..."
              placeholderTextColor={ph}
              multiline
              numberOfLines={3}
              style={styles.notes}
            />
          </View>
        </View>

        <TouchableOpacity onPress={handleSubmit} disabled={submitting} style={styles.submitBtn} activeOpacity={0.85}>
          <Text style={styles.submitText}>{submitting ? 'Saving…' : `Log ${selectedType.label}`}</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}
