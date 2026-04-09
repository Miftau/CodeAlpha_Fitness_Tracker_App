export interface Activity {
    id: string;
    userId: string;         // Firebase user UID
    type: 'steps' | 'workout' | 'calories' | 'weight' | 'sleep' | 'distance';
    value: number;
    unit: string;           // e.g., "steps", "kcal", "kg", "hours", "km"
    notes?: string;
    date: string;           // ISO string: "2025-04-05"
    createdAt: string;      // Timestamp
    updatedAt?: string;
}

export interface DailySummary {
    userId: string;
    date: string;           // "2025-04-05"
    totalSteps: number;
    totalCalories: number;
    workoutCount: number;
    avgSleepHours: number;
    createdAt: string;
}