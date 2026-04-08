import React from 'react';
import { View, Text, ScrollView, Alert, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import AutoTracker from '@/components/AutoTracker';
import { useActivities } from '@/hooks/useActivities';

export default function TrackerScreen() {
    const router = useRouter();
    const isDark = useColorScheme() === 'dark';
    const { logActivity } = useActivities();

    const handleTrackComplete = async (counts: { steps: number; pushups: number }) => {
        try {
            const promises = [];

            if (counts.steps > 0) {
                promises.push(logActivity({
                    type: 'steps',
                    value: counts.steps,
                    unit: 'steps',
                    notes: 'Auto-tracked steps',
                    date: new Date().toISOString().split('T')[0],
                }));
            }

            if (counts.pushups > 0) {
                promises.push(logActivity({
                    type: 'workout',
                    value: counts.pushups,
                    unit: 'reps',
                    notes: `Auto-tracked pushups: ${counts.pushups} reps`,
                    date: new Date().toISOString().split('T')[0],
                }));
            }

            if (promises.length > 0) {
                await Promise.all(promises);
                Alert.alert(
                    'Success',
                    'Tracking data saved successfully!',
                    [{ text: 'OK', onPress: () => router.push('/(drawer)/(tabs)/index') }]
                );
            } else {
                Alert.alert('No Data', 'No activity was recorded.');
            }
        } catch (error) {
            console.error('Error saving tracking data:', error);
            Alert.alert('Error', 'Failed to save tracking data.');
        }
    };

    return (
        <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <ScrollView className="p-4">
                <View className="mb-6">
                    <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Activity Tracker
                    </Text>
                    <Text className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Use motion sensors to automatically track your exercises.
                    </Text>
                </View>

                {/* Auto Tracker Component */}
                <AutoTracker onTrackComplete={handleTrackComplete} />

                {/* Instructions */}
                <View className={`mt-8 p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                    <Text className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        How it works:
                    </Text>
                    <Text className={`text-xs leading-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        • Start Tracking: Begins monitoring device motion.{"\n"}
                        • Steps: Counted as you move with the device.{"\n"}
                        • Pushups: Recoginzed through specific acceleration patterns when holding the device or having it in your pocket.{"\n"}
                        • Save: Persists the data to your activity log.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}