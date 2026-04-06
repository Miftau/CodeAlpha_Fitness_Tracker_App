import { useState, useEffect } from 'react';
import { scheduleWorkoutNotification, cancelWorkoutNotification } from '../../services/notificationService';

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
    const [loading, setLoading] = useState(false);

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

            setScheduledWorkouts(prev => [...prev, newWorkout]);
        } catch (error) {
            console.error('Error scheduling workout:', error);
        } finally {
            setLoading(false);
        }
    };

    const cancelScheduledWorkout = async (workoutId: string) => {
        try {
            await cancelWorkoutNotification(workoutId);
            setScheduledWorkouts(prev => prev.filter(w => w.id !== workoutId));
        } catch (error) {
            console.error('Error cancelling workout:', error);
        }
    };

    const markAsCompleted = (workoutId: string) => {
        setScheduledWorkouts(prev =>
            prev.map(w => w.id === workoutId ? { ...w, completed: true } : w)
        );
    };

    return {
        scheduledWorkouts,
        loading,
        scheduleWorkout,
        cancelScheduledWorkout,
        markAsCompleted,
    };
};