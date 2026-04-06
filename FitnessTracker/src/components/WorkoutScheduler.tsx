import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useColorScheme } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useWorkoutScheduler } from '@/hooks/useWorkoutScheduler';

interface Props {
    onSchedule: () => void;
}

export default function WorkoutScheduler({ onSchedule }: Props) {
    const isDark = useColorScheme() === 'dark';
    const { scheduleWorkout, loading } = useWorkoutScheduler();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        scheduledTime: new Date(Date.now() + 3600000), // Default: 1 hour from now
    });
    const [showDatePicker, setShowDatePicker] = useState(false);

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
            setFormData({
                ...formData,
                scheduledTime: selectedDate,
            });
        }
    };

    return (
        <View className={`rounded-2xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white'
            }`}>
            <Text className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'
                }`}>
                Schedule Workout
            </Text>

            <View className="space-y-4">
                <TextInput
                    value={formData.title}
                    onChangeText={(text) => setFormData({ ...formData, title: text })}
                    placeholder="Workout title (e.g., Morning Run)"
                    className={`border rounded-lg px-4 py-3 ${isDark
                            ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400'
                            : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'
                        }`}
                />

                <TextInput
                    value={formData.description}
                    onChangeText={(text) => setFormData({ ...formData, description: text })}
                    placeholder="Description (optional)"
                    multiline
                    numberOfLines={2}
                    className={`border rounded-lg px-4 py-3 ${isDark
                            ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400'
                            : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'
                        }`}
                />

                <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    className={`border rounded-lg px-4 py-3 ${isDark
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                >
                    <Text className={`${isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                        {formData.scheduledTime.toLocaleString()}
                    </Text>
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        value={formData.scheduledTime}
                        mode="datetime"
                        display="default"
                        onChange={handleDateChange}
                        minimumDate={new Date()}
                    />
                )}

                <TouchableOpacity
                    onPress={handleSchedule}
                    disabled={loading}
                    className={`py-3 rounded-xl ${isDark ? 'bg-blue-600' : 'bg-blue-500'
                        } ${loading ? 'opacity-70' : ''}`}
                >
                    <Text className="text-white font-medium text-center">
                        {loading ? 'Scheduling...' : 'Schedule Workout'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}