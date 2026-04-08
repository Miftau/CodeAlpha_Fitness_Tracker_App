import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATIONS_KEY = '@fitness_notifications_enabled';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const setupNotifications = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#6366f1',
    });
  }
};

export const checkNotificationPermissions = async (): Promise<boolean> => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  return finalStatus === 'granted';
};

export const enableDailyReminders = async () => {
    const hasPermission = await checkNotificationPermissions();
    if (!hasPermission) return false;

    try {
        // Cancel all existing to avoid duplicates
        await Notifications.cancelAllScheduledNotificationsAsync();

        // Schedule daily at 6:00 PM (18:00)
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Time to log your activity! 💪",
                body: "Don't forget to record your steps, workouts, or calories for today.",
                sound: true,
            },
            trigger: {
                type: 'daily',
                hour: 18,
                minute: 0,
            },
        });
        await AsyncStorage.setItem(NOTIFICATIONS_KEY, 'true');
        return true;
    } catch (e) {
        console.error("Failed to schedule notification:", e);
        return false;
    }
};

export const disableDailyReminders = async () => {
    try {
        await Notifications.cancelAllScheduledNotificationsAsync();
        await AsyncStorage.setItem(NOTIFICATIONS_KEY, 'false');
        return true;
    } catch (e) {
        console.error("Failed to cancel notifications:", e);
        return false;
    }
};

export const getNotificationPreference = async (): Promise<boolean> => {
    try {
        const stored = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
        return stored === 'true';
    } catch (e) {
        return false;
    }
};
