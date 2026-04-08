import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Animated,
    Platform,
} from 'react-native';
import { useColorScheme } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useWorkoutScheduler } from '@/hooks/useWorkoutScheduler';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    onSchedule: () => void;
    initialData?: {
      id: string;
      title: string;
      description: string;
      scheduledTime: Date;
    };
    onUpdate?: (id: string, updates: any) => Promise<void>;
    onCancelEdit?: () => void;
}

export default function WorkoutScheduler({ onSchedule, initialData, onUpdate, onCancelEdit }: Props) {
    const isDark = useColorScheme() === 'dark';
    const { scheduleWorkout, loading: hookLoading } = useWorkoutScheduler();
    const [localLoading, setLocalLoading] = useState(false);
    const loading = hookLoading || localLoading;

    const [formData, setFormData] = useState({
        title: initialData?.title ?? '',
        description: initialData?.description ?? '',
        scheduledTime: initialData?.scheduledTime ?? new Date(Date.now() + 3600000),
    });

    // Sync form with initialData if it changes (e.g. when clicking Edit on a different card)
    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title,
                description: initialData.description,
                scheduledTime: new Date(initialData.scheduledTime),
            });
        }
    }, [initialData]);

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
    const [titleFocused, setTitleFocused] = useState(false);
    const [descFocused, setDescFocused] = useState(false);

    const colors = {
        card: isDark ? '#1c2333' : '#ffffff',
        surface: isDark ? '#252d3d' : '#f8faff',
        border: isDark ? '#2e3a50' : '#e2e8f0',
        borderFocus: '#6366f1',
        text: isDark ? '#f1f5f9' : '#0f172a',
        subtext: isDark ? '#64748b' : '#94a3b8',
        accent: '#6366f1',
        accentSoft: isDark ? '#312e81' : '#eef2ff',
        buttonBg: '#6366f1',
        buttonDisabled: isDark ? '#374151' : '#c7d2fe',
        placeholder: isDark ? '#4b5563' : '#94a3b8',
        dateBadge: isDark ? '#1b2a4e' : '#eef2ff',
        dateBadgeText: isDark ? '#60a5fa' : '#4f46e5',
        shadow: isDark ? '#000000' : '#6366f1',
    };

    const handleAction = async () => {
        if (!formData.title.trim()) {
            return;
        }
        setLocalLoading(true);
        try {
            if (initialData && onUpdate) {
                await onUpdate(initialData.id, {
                    title: formData.title,
                    description: formData.description,
                    scheduledTime: formData.scheduledTime,
                });
                if (onCancelEdit) onCancelEdit();
            } else {
                await scheduleWorkout({
                    title: formData.title,
                    description: formData.description,
                    scheduledTime: formData.scheduledTime,
                });
                onSchedule();
            }
            // Reset if not editing
            if (!initialData) {
              setFormData({
                  title: '',
                  description: '',
                  scheduledTime: new Date(Date.now() + 3600000),
              });
            }
        } catch (error) {
            console.error('Error in WorkoutScheduler action:', error);
        } finally {
            setLocalLoading(false);
        }
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        // On Android, the picker unmounts immediately on selection
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
            if (event.type === 'set' && selectedDate) {
                const newDate = new Date(formData.scheduledTime);
                if (pickerMode === 'date') {
                    newDate.setFullYear(selectedDate.getFullYear());
                    newDate.setMonth(selectedDate.getMonth());
                    newDate.setDate(selectedDate.getDate());
                    setFormData({ ...formData, scheduledTime: newDate });
                    // Immediately trigger time picker after date is set
                    setTimeout(() => {
                        setPickerMode('time');
                        setShowDatePicker(true);
                    }, 100);
                } else {
                    newDate.setHours(selectedDate.getHours());
                    newDate.setMinutes(selectedDate.getMinutes());
                    setFormData({ ...formData, scheduledTime: newDate });
                }
            }
        } else {
            // iOS remains visible and handles datetime mode well
            if (selectedDate) {
                setFormData({ ...formData, scheduledTime: selectedDate });
            }
            if (event.type === 'dismissed') {
                setShowDatePicker(false);
            }
        }
    };

    const showPicker = () => {
        setPickerMode('date');
        setShowDatePicker(true);
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

    return (
        <View style={styles.card}>
            {/* Header */}
            <View style={styles.headerRow}>
                <View style={[styles.iconBadge, initialData && { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                    <Ionicons 
                      name={initialData ? "create" : "sparkles"} 
                      size={20} 
                      color={initialData ? '#10b981' : colors.accent} 
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.title, { color: colors.text }]}>
                      {initialData ? 'Edit Session' : 'Schedule Session'}
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.subtext }]}>
                      {initialData ? 'Update your plans' : 'Lock in your next workout'}
                    </Text>
                </View>
                {initialData && onCancelEdit && (
                  <TouchableOpacity onPress={onCancelEdit} style={styles.cancelLink}>
                    <Text style={{ color: '#ef4444', fontWeight: '600' }}>Cancel</Text>
                  </TouchableOpacity>
                )}
            </View>

            {/* Title Field */}
            <View style={styles.fieldGroup}>
                <Text style={[styles.label, { color: colors.subtext }]}>Workout Title</Text>
                <View style={[
                  styles.inputWrapper, 
                  { 
                    borderColor: titleFocused ? colors.borderFocus : colors.border,
                    backgroundColor: colors.surface
                  }
                ]}>
                    <Ionicons
                        name="barbell-outline"
                        size={18}
                        color={titleFocused ? colors.accent : colors.subtext}
                        style={styles.inputIcon}
                    />
                    <TextInput
                        value={formData.title}
                        onChangeText={(text) => setFormData({ ...formData, title: text })}
                        placeholder="Push Day, Cardio, etc."
                        placeholderTextColor={colors.placeholder}
                        style={[styles.input, { color: colors.text }]}
                        onFocus={() => setTitleFocused(true)}
                        onBlur={() => setTitleFocused(false)}
                    />
                </View>
            </View>

            {/* Description Field */}
            <View style={styles.fieldGroup}>
                <Text style={[styles.label, { color: colors.subtext }]}>Notes</Text>
                <View style={[
                  styles.textAreaWrapper, 
                  { 
                    borderColor: descFocused ? colors.borderFocus : colors.border,
                    backgroundColor: colors.surface
                  }
                ]}>
                    <TextInput
                        value={formData.description}
                        onChangeText={(text) => setFormData({ ...formData, description: text })}
                        placeholder="Leg day with focus on quads..."
                        placeholderTextColor={colors.placeholder}
                        multiline
                        numberOfLines={2}
                        style={[styles.textArea, { color: colors.text }]}
                        onFocus={() => setDescFocused(true)}
                        onBlur={() => setDescFocused(false)}
                    />
                </View>
            </View>

            {/* Date/Time Picker */}
            <View style={styles.fieldGroup}>
                <TouchableOpacity
                    onPress={showPicker}
                    style={[styles.dateButton, { backgroundColor: colors.dateBadge }]}
                    activeOpacity={0.75}
                >
                    <Ionicons name="time" size={18} color={colors.dateBadgeText} />
                    <Text style={[styles.dateButtonText, { color: colors.dateBadgeText }]}>{formatDate(formData.scheduledTime)}</Text>
                    <Ionicons name="chevron-down" size={16} color={colors.dateBadgeText} />
                </TouchableOpacity>
            </View>

            {showDatePicker && (
                <DateTimePicker
                    value={formData.scheduledTime}
                    mode={Platform.OS === 'android' ? pickerMode : 'datetime'}
                    display={Platform.OS === 'android' ? 'default' : 'spinner'}
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                />
            )}

            {/* Submit Button */}
            <TouchableOpacity
                onPress={handleAction}
                disabled={loading || !formData.title.trim()}
                style={[
                  styles.scheduleButton, 
                  { backgroundColor: loading || !formData.title.trim() ? colors.buttonDisabled : (initialData ? '#10b981' : colors.buttonBg) }
                ]}
                activeOpacity={0.85}
            >
                {loading ? (
                    <ActivityIndicator size="small" color="#ffffff" style={styles.buttonIcon} />
                ) : (
                    <Ionicons name={initialData ? "save" : "add-circle"} size={20} color="#ffffff" style={styles.buttonIcon} />
                )}
                <Text style={styles.scheduleButtonText}>
                    {loading ? 'Please wait...' : (initialData ? 'Update Schedule' : 'Add to Schedule')}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 24,
        padding: 20,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    iconBadge: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(99, 102, 241, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: -0.3,
    },
    subtitle: {
        fontSize: 12,
        marginTop: 1,
    },
    cancelLink: {
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    fieldGroup: {
        marginBottom: 12,
    },
    label: {
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        marginBottom: 6,
        marginLeft: 2,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1.5,
        paddingHorizontal: 12,
    },
    inputIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        paddingVertical: 10,
        fontSize: 14,
    },
    textAreaWrapper: {
        borderRadius: 12,
        borderWidth: 1.5,
        paddingHorizontal: 12,
        paddingTop: 8,
    },
    textArea: {
        fontSize: 14,
        minHeight: 50,
        textAlignVertical: 'top',
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        gap: 10,
    },
    dateButtonText: {
        fontSize: 13,
        fontWeight: '700',
        flex: 1,
    },
    scheduleButton: {
        borderRadius: 14,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    scheduleButtonText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '700',
    },
    buttonIcon: {
        marginRight: 6,
    },
});