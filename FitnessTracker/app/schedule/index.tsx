import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'react-native';
import WorkoutScheduler from '@/components/WorkoutScheduler';
import { useWorkoutScheduler } from '@/hooks/useWorkoutScheduler';

export default function ScheduleScreen() {
    const router = useRouter();
    const isDark = useColorScheme() === 'dark';
    const { scheduledWorkouts, cancelScheduledWorkout } = useWorkoutScheduler();

    const handleCancel = async (workoutId: string) => {
        Alert.alert(
            'Confirm Cancel',
            'Are you sure you want to cancel this scheduled workout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Yes',
                    onPress: async () => {
                        await cancelScheduledWorkout(workoutId);
                        Alert.alert('Cancelled', 'Workout has been cancelled');
                    }
                }
            ]
        );
    };

    return (
        <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'
            }`}>
            <ScrollView className="p-4">
                <Text className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                    Schedule Workouts
                </Text>

                <WorkoutScheduler onSchedule={() => { }} />

                {scheduledWorkouts.length > 0 && (
                    <View className="mt-8">
                        <Text className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'
                            }`}>
                            Upcoming Workouts
                        </Text>

                        {scheduledWorkouts.map((workout) => (
                            <View
                                key={workout.id}
                                className={`rounded-lg p-4 mb-3 ${isDark ? 'bg-gray-800' : 'bg-white'
                                    }`}
                            >
                                <Text className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'
                                    }`}>
                                    {workout.title}
                                </Text>
                                {workout.description && (
                                    <Text className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'
                                        }`}>
                                        {workout.description}
                                    </Text>
                                )}
                                <Text className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'
                                    }`}>
                                    {workout.scheduledTime.toLocaleString()}
                                </Text>
                                <TouchableOpacity
                                    onPress={() => handleCancel(workout.id)}
                                    className={`mt-3 py-2 px-4 rounded ${isDark ? 'bg-red-700' : 'bg-red-500'
                                        }`}
                                >
                                    <Text className="text-white text-center text-sm">
                                        Cancel Workout
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}