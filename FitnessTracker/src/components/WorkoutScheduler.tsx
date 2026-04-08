import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { useColorScheme } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useWorkoutScheduler } from '@/hooks/useWorkoutScheduler';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    onSchedule: () => void;
}

export default function WorkoutScheduler({ onSchedule }: Props) {
    const isDark = useColorScheme() === 'dark';
    const { scheduleWorkout, loading } = useWorkoutScheduler();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        scheduledTime: new Date(Date.now() + 3600000),
    });
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [titleFocused, setTitleFocused] = useState(false);
    const [descFocused, setDescFocused] = useState(false);

    const colors = {
        card: isDark ? '#1c2333' : '#ffffff',
        surface: isDark ? '#252d3d' : '#f8faff',
        border: isDark ? '#2e3a50' : '#e2e8f0',
        borderFocus: '#6366f1',
        text: isDark ? '#f1f5f9' : '#0f172a',
        subtext: isDark ? '#94a3b8' : '#64748b',
        accent: '#6366f1',
        accentSoft: isDark ? '#312e81' : '#eef2ff',
        buttonBg: '#6366f1',
        buttonDisabled: isDark ? '#374151' : '#c7d2fe',
        placeholder: isDark ? '#4b5563' : '#94a3b8',
        dateBadge: isDark ? '#1e3a5f' : '#dbeafe',
        dateBadgeText: isDark ? '#93c5fd' : '#1d4ed8',
        shadow: isDark ? '#000000' : '#6366f1',
    };

    const handleSchedule = async () => {
        if (!formData.title.trim()) {
            alert('Please enter a workout title');
            return;
        }
        try {
            await scheduleWorkout({
                title: formData.title,
                description: formData.description,
                scheduledTime: formData.scheduledTime,
            });
            onSchedule();
            setFormData({
                title: '',
                description: '',
                scheduledTime: new Date(Date.now() + 3600000),
            });
        } catch (error) {
            console.error('Error scheduling workout:', error);
            alert('Failed to schedule workout');
        }
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setFormData({ ...formData, scheduledTime: selectedDate });
        }
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const styles = StyleSheet.create({
        card: {
            backgroundColor: colors.card,
            borderRadius: 24,
            padding: 24,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: isDark ? 0.4 : 0.12,
            shadowRadius: 20,
            elevation: 10,
        },
        headerRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 24,
        },
        iconBadge: {
            width: 44,
            height: 44,
            borderRadius: 14,
            backgroundColor: colors.accentSoft,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
        },
        title: {
            fontSize: 20,
            fontWeight: '700',
            color: colors.text,
            letterSpacing: -0.3,
        },
        subtitle: {
            fontSize: 13,
            color: colors.subtext,
            marginTop: 1,
        },
        fieldGroup: {
            marginBottom: 16,
        },
        label: {
            fontSize: 12,
            fontWeight: '600',
            color: colors.subtext,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
            marginBottom: 8,
            marginLeft: 2,
        },
        inputWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.surface,
            borderRadius: 14,
            borderWidth: 1.5,
            paddingHorizontal: 14,
        },
        inputIcon: {
            marginRight: 10,
        },
        input: {
            flex: 1,
            paddingVertical: 13,
            fontSize: 15,
            color: colors.text,
        },
        textAreaWrapper: {
            backgroundColor: colors.surface,
            borderRadius: 14,
            borderWidth: 1.5,
            paddingHorizontal: 14,
            paddingTop: 12,
        },
        textArea: {
            fontSize: 15,
            color: colors.text,
            minHeight: 70,
            textAlignVertical: 'top',
        },
        divider: {
            height: 1,
            backgroundColor: colors.border,
            marginVertical: 16,
        },
        dateLabel: {
            fontSize: 12,
            fontWeight: '600',
            color: colors.subtext,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
            marginBottom: 8,
            marginLeft: 2,
        },
        dateButton: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.dateBadge,
            borderRadius: 14,
            paddingVertical: 13,
            paddingHorizontal: 16,
        },
        dateButtonText: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.dateBadgeText,
            marginLeft: 8,
            flex: 1,
        },
        dateChevron: {
            marginLeft: 'auto',
        },
        scheduleButton: {
            backgroundColor: loading ? colors.buttonDisabled : colors.buttonBg,
            borderRadius: 16,
            paddingVertical: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 8,
            shadowColor: colors.accent,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: loading ? 0 : 0.35,
            shadowRadius: 10,
            elevation: loading ? 0 : 6,
        },
        scheduleButtonText: {
            color: '#ffffff',
            fontSize: 16,
            fontWeight: '700',
            letterSpacing: 0.3,
        },
        buttonIcon: {
            marginRight: 8,
        },
    });

    return (
        <View style={styles.card}>
            {/* Header */}
            <View style={styles.headerRow}>
                <View style={styles.iconBadge}>
                    <Ionicons name="calendar" size={22} color={colors.accent} />
                </View>
                <View>
                    <Text style={styles.title}>Schedule Workout</Text>
                    <Text style={styles.subtitle}>Plan your next session</Text>
                </View>
            </View>

            {/* Title Field */}
            <View style={styles.fieldGroup}>
                <Text style={styles.label}>Workout Title</Text>
                <View style={[styles.inputWrapper, { borderColor: titleFocused ? colors.borderFocus : colors.border }]}>
                    <Ionicons
                        name="barbell-outline"
                        size={18}
                        color={titleFocused ? colors.accent : colors.subtext}
                        style={styles.inputIcon}
                    />
                    <TextInput
                        value={formData.title}
                        onChangeText={(text) => setFormData({ ...formData, title: text })}
                        placeholder="e.g. Morning Run, HIIT Session"
                        placeholderTextColor={colors.placeholder}
                        style={styles.input}
                        onFocus={() => setTitleFocused(true)}
                        onBlur={() => setTitleFocused(false)}
                    />
                </View>
            </View>

            {/* Description Field */}
            <View style={styles.fieldGroup}>
                <Text style={styles.label}>Notes (optional)</Text>
                <View style={[styles.textAreaWrapper, { borderColor: descFocused ? colors.borderFocus : colors.border }]}>
                    <TextInput
                        value={formData.description}
                        onChangeText={(text) => setFormData({ ...formData, description: text })}
                        placeholder="Add a short description or note..."
                        placeholderTextColor={colors.placeholder}
                        multiline
                        numberOfLines={3}
                        style={styles.textArea}
                        onFocus={() => setDescFocused(true)}
                        onBlur={() => setDescFocused(false)}
                    />
                </View>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Date/Time Picker */}
            <View style={styles.fieldGroup}>
                <Text style={styles.dateLabel}>Scheduled Time</Text>
                <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    style={styles.dateButton}
                    activeOpacity={0.75}
                >
                    <Ionicons name="time-outline" size={18} color={colors.dateBadgeText} />
                    <Text style={styles.dateButtonText}>{formatDate(formData.scheduledTime)}</Text>
                    <Ionicons name="chevron-forward" size={16} color={colors.dateBadgeText} style={styles.dateChevron} />
                </TouchableOpacity>
            </View>

            {showDatePicker && (
                <DateTimePicker
                    value={formData.scheduledTime}
                    mode="datetime"
                    display="default"
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                />
            )}

            {/* Submit Button */}
            <TouchableOpacity
                onPress={handleSchedule}
                disabled={loading}
                style={styles.scheduleButton}
                activeOpacity={0.85}
            >
                {loading ? (
                    <ActivityIndicator size="small" color="#ffffff" style={styles.buttonIcon} />
                ) : (
                    <Ionicons name="checkmark-circle-outline" size={20} color="#ffffff" style={styles.buttonIcon} />
                )}
                <Text style={styles.scheduleButtonText}>
                    {loading ? 'Scheduling...' : 'Schedule Workout'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}