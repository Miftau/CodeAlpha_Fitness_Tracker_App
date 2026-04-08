import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@fitness_goals';

export interface Goals {
    steps: number;
    calories: number;
    workouts: number;
    sleep: number;
}

const DEFAULT_GOALS: Goals = {
    steps: 10000,
    calories: 500,
    workouts: 1,
    sleep: 8,
};

export const useGoals = () => {
    const [goals, setGoals] = useState<Goals>(DEFAULT_GOALS);
    const [loading, setLoading] = useState(true);

    // Load goals from storage on mount
    useEffect(() => {
        const load = async () => {
            try {
                const stored = await AsyncStorage.getItem(STORAGE_KEY);
                if (stored) {
                    setGoals({ ...DEFAULT_GOALS, ...JSON.parse(stored) });
                }
            } catch (e) {
                console.error('Failed to load goals:', e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    // Save a single goal field
    const updateGoal = useCallback(async (key: keyof Goals, value: number) => {
        const updated = { ...goals, [key]: value };
        setGoals(updated);
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch (e) {
            console.error('Failed to save goal:', e);
        }
    }, [goals]);

    // Save all goals at once
    const saveGoals = useCallback(async (newGoals: Goals) => {
        setGoals(newGoals);
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newGoals));
        } catch (e) {
            console.error('Failed to save goals:', e);
        }
    }, []);

    // Reset to defaults
    const resetGoals = useCallback(async () => {
        setGoals(DEFAULT_GOALS);
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_GOALS));
        } catch (e) {
            console.error('Failed to reset goals:', e);
        }
    }, []);

    return { goals, loading, updateGoal, saveGoals, resetGoals };
};
