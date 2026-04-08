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

// ── Weekly steps chart data from real Firestore data ────────────────────────
export interface WeeklyBarPoint {
    label: string;
    value: number;
    max: number;
}

export const useWeeklySteps = (goalMax: number = 10000) => {
    const { user } = useAuth();
    const [weeklyData, setWeeklyData] = useState<WeeklyBarPoint[]>([]);
    const [loading, setLoading] = useState(true);

    const loadWeekly = async () => {
        if (!user) return;

        const days: { label: string; dateStr: string }[] = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            days.push({
                label: d.toLocaleDateString('en-US', { weekday: 'short' }),
                dateStr: d.toISOString().split('T')[0],
            });
        }

        const startDate = days[0].dateStr;
        const endDate = days[days.length - 1].dateStr;

        try {
            setLoading(true);
            const allActivities = await getActivitiesByRange(user.uid, startDate, endDate);

            const stepsByDate: Record<string, number> = {};
            for (const act of allActivities) {
                if (act.type === 'steps') {
                    stepsByDate[act.date] = (stepsByDate[act.date] ?? 0) + act.value;
                }
            }

            const points: WeeklyBarPoint[] = days.map(({ label, dateStr }) => ({
                label,
                value: stepsByDate[dateStr] ?? 0,
                max: goalMax,
            }));

            setWeeklyData(points);
        } catch (e) {
            console.error('Failed to load weekly steps:', e);
            setWeeklyData(days.map(({ label }) => ({ label, value: 0, max: goalMax })));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadWeekly();
    }, [user, goalMax]);

    return { weeklyData, loading, refetch: loadWeekly };
};