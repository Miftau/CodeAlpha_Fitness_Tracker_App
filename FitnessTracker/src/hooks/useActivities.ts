import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import {
    getActivitiesByDate,
    getActivitiesByRange,
    addActivity,
    getDailySummary,
} from '@/firebase/firestore';
import { Activity } from '@/firebase/types';

export const useActivities = (date?: string) => {
    const { user } = useAuth();
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadActivities = async () => {
        if (!user) return;

        try {
            setLoading(true);
            setError(null);
            const data = await getActivitiesByDate(user.uid, date || new Date().toISOString().split('T')[0]);
            setActivities(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load activities');
        } finally {
            setLoading(false);
        }
    };

    const logActivity = async (activity: Omit<Activity, 'id' | 'userId' | 'createdAt'>) => {
        if (!user) return;

        try {
            await addActivity(user.uid, activity);
            await loadActivities(); // Refresh
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to log activity');
        }
    };

    useEffect(() => {
        loadActivities();
    }, [user, date]);

    return {
        activities,
        loading,
        error,
        refetch: loadActivities,
        logActivity,
    };
};