import React from 'react';
import { View, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'react-native';
import Timer from '@/components/Timer';
import { useActivities } from '@/hooks/useActivities';

export default function TimerScreen() {
    const router = useRouter();
    const isDark = useColorScheme() === 'dark';
    const { logActivity } = useActivities();

    const handleTimerComplete = async (duration: number) => {
        try {
            await logActivity({
                type: 'workout',
                value: duration,
                unit: 'seconds',
                notes: `Workout timed using built-in timer (${Math.floor(duration / 60)} min)`,
                date: new Date().toISOString().split('T')[0],
            });

            Alert.alert(
                'Workout Saved',
                `Workout duration: ${Math.floor(duration / 60)} min ${duration % 60} sec`,
                [{ text: 'OK', onPress: () => router.back() }]
            );
        } catch (error) {
            console.error('Error saving timer workout:', error);
            Alert.alert('Error', 'Failed to save workout');
        }
    };

    return (
        <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'
            }`}>
            <View className="p-4">
                <Text className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                    Workout Timer
                </Text>

                <Text className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                    Time your workouts and save the duration automatically.
                </Text>

                <Timer onComplete={handleTimerComplete} />
            </View>
        </View>
    );
}