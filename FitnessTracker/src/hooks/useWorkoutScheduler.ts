import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scheduleWorkoutNotification, cancelWorkoutNotification } from '../../services/notificationService';

const WORKOUT_SCHEDULE_KEYS = '@fitness_workout_schedules';

export interface ScheduledWorkout {
    id: string;
    title: string;
    description: string;
    scheduledTime: Date;
    notificationId?: string;
    completed: boolean;
}

export const useWorkoutScheduler = () => {
    const [scheduledWorkouts, setScheduledWorkouts] = useState<ScheduledWorkout[]>([]);
    const [loading, setLoading] = useState(true);

    const loadSchedules = async () => {
        try {
            setLoading(true);
            const stored = await AsyncStorage.getItem(WORKOUT_SCHEDULE_KEYS);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Restore date strings to actual Date objects
                const mapped = parsed.map((item: any) => ({
                    ...item,
                    scheduledTime: new Date(item.scheduledTime)
                }));
                setScheduledWorkouts(mapped);
            }
        } catch (e) {
            console.error('Failed to load schedules:', e);
        } finally {
            setLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        loadSchedules();
    }, []);

    // Save strictly upon changes
    const persistSchedules = async (newSchedules: ScheduledWorkout[]) => {
        try {
            await AsyncStorage.setItem(WORKOUT_SCHEDULE_KEYS, JSON.stringify(newSchedules));
            setScheduledWorkouts(newSchedules);
        } catch (e) {
            console.error('Failed to save schedules:', e);
        }
    };

    const scheduleWorkout = async (workout: Omit<ScheduledWorkout, 'id' | 'completed' | 'notificationId'>) => {
        setLoading(true);
        try {
            const workoutId = Date.now().toString();
            const notificationId = await scheduleWorkoutNotification(
                workout.title,
                workout.description,
                workout.scheduledTime,
                workoutId
            );

            const newWorkout: ScheduledWorkout = {
                ...workout,
                id: workoutId,
                notificationId,
                completed: false,
            };

            const updated = [...scheduledWorkouts, newWorkout];
            await persistSchedules(updated);
        } catch (error) {
            console.error('Error scheduling workout:', error);
        } finally {
            setLoading(false);
        }
    };

    const cancelScheduledWorkout = async (workoutId: string) => {
        try {
            const workout = scheduledWorkouts.find(w => w.id === workoutId);
            if (workout?.notificationId) {
                await cancelWorkoutNotification(workout.notificationId);
            }
            const updated = scheduledWorkouts.filter(w => w.id !== workoutId);
            await persistSchedules(updated);
        } catch (error) {
            console.error('Error cancelling workout:', error);
        }
    };

    const updateWorkout = async (workoutId: string, updates: Partial<Omit<ScheduledWorkout, 'id' | 'notificationId'>>) => {
        setLoading(true);
        try {
            const existing = scheduledWorkouts.find(w => w.id === workoutId);
            if (!existing) return;

            // If time or title changed, update notification
            let newNotificationId = existing.notificationId;
            if (updates.scheduledTime || updates.title || updates.description) {
                if (existing.notificationId) {
                    await cancelWorkoutNotification(existing.notificationId);
                }
                newNotificationId = await scheduleWorkoutNotification(
                    updates.title ?? existing.title,
                    updates.description ?? existing.description,
                    updates.scheduledTime ?? existing.scheduledTime,
                    workoutId
                );
            }

            const updatedList = scheduledWorkouts.map(w => 
                w.id === workoutId 
                    ? { ...w, ...updates, notificationId: newNotificationId } 
                    : w
            );
            await persistSchedules(updatedList);
        } catch (error) {
            console.error('Error updating workout:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsCompleted = (workoutId: string) => {
        const updated = scheduledWorkouts.map(w => w.id === workoutId ? { ...w, completed: true } : w);
        persistSchedules(updated);
    };

    return {
        scheduledWorkouts,
        loading,
        scheduleWorkout,
        updateWorkout,
        cancelScheduledWorkout,
        markAsCompleted,
        refetch: loadSchedules,
    };
};