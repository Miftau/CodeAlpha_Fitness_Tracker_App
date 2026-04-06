import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure notification behavior
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export const scheduleWorkoutNotification = async (
    title: string,
    body: string,
    scheduledTime: Date,
    workoutId: string
) => {
    const identifier = await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
            data: { workoutId },
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: scheduledTime,
        },
    });

    // Store scheduled notification ID for potential cancellation
    await AsyncStorage.setItem(`notification_${workoutId}`, identifier);
    return identifier;
};

export const cancelWorkoutNotification = async (workoutId: string) => {
    const identifier = await AsyncStorage.getItem(`notification_${workoutId}`);
    if (identifier) {
        await Notifications.cancelScheduledNotificationAsync(identifier);
        await AsyncStorage.removeItem(`notification_${workoutId}`);
    }
};

export const requestNotificationPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
};