import { Accelerometer, Gyroscope } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Thresholds for motion detection
const STEP_THRESHOLD = 0.5; // Adjust based on sensitivity needed
const PUSHUP_THRESHOLD = 1.0; // Higher acceleration for pushups

// Calculation Constants (Averages)
const STEP_LENGTH_METERS = 0.762; // 0.762m per step (~2.5 feet)
const CALORIES_PER_STEP = 0.045; // kcal per step for 70kg person
const CALORIES_PER_PUSHUP = 0.5; // kcal per pushup

export class MotionDetector {
    private isTracking = false;
    private stepCount = 0;
    private pushupCount = 0;
    private distanceMeters = 0;
    private caloriesBurned = 0;
    private lastAcceleration: { x: number; y: number; z: number } | null = null;
    private accelerationHistory: number[] = [];
    private maxHistoryLength = 10;

    constructor() {
        this.setupListeners();
    }

    private setupListeners = () => {
        Accelerometer.setUpdateInterval(100); // 100ms updates
        Gyroscope.setUpdateInterval(100);
    };

    startTracking = (onData: (data: { steps: number; pushups: number; distance: number; calories: number }) => void) => {
        if (this.isTracking) return;

        this.isTracking = true;

        const subscription = Accelerometer.addListener((acceleration) => {
            this.processAcceleration(acceleration, onData);
        });

        return subscription;
    };

    stopTracking = () => {
        this.isTracking = false;
        Accelerometer.removeAllListeners();
    };

    private processAcceleration = (
        acceleration: { x: number; y: number; z: number },
        onData: (data: { steps: number; pushups: number; distance: number; calories: number }) => void
    ) => {
        if (!this.lastAcceleration) {
            this.lastAcceleration = acceleration;
            return;
        }

        // Calculate magnitude of acceleration change
        const deltaX = Math.abs(acceleration.x - this.lastAcceleration.x);
        const deltaY = Math.abs(acceleration.y - this.lastAcceleration.y);
        const deltaZ = Math.abs(acceleration.z - this.lastAcceleration.z);
        const magnitude = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);

        // Add to history
        this.accelerationHistory.push(magnitude);
        if (this.accelerationHistory.length > this.maxHistoryLength) {
            this.accelerationHistory.shift();
        }

        // Detect steps (walking/running)
        if (magnitude > STEP_THRESHOLD) {
            this.stepCount++;
            this.distanceMeters += STEP_LENGTH_METERS;
            this.caloriesBurned += CALORIES_PER_STEP;
            this.lastAcceleration = acceleration;
        }

        // Detect pushups
        if (magnitude > PUSHUP_THRESHOLD && this.isLikelyPushup()) {
            this.pushupCount++;
            this.caloriesBurned += CALORIES_PER_PUSHUP;
            this.lastAcceleration = acceleration;
        }

        onData({ 
            steps: this.stepCount, 
            pushups: this.pushupCount,
            distance: Number((this.distanceMeters / 1000).toFixed(2)), // Convert to km
            calories: Number(this.caloriesBurned.toFixed(1))
        });
    };

    private isLikelyPushup = (): boolean => {
        // Simple heuristic: check for consistent high-magnitude events
        const recentHighValues = this.accelerationHistory.filter(v => v > PUSHUP_THRESHOLD);
        return recentHighValues.length >= 3; // At least 3 high values in recent history
    };

    resetCounts = () => {
        this.stepCount = 0;
        this.pushupCount = 0;
        this.distanceMeters = 0;
        this.caloriesBurned = 0;
        this.accelerationHistory = [];
    };

    getCounts = () => ({
        steps: this.stepCount,
        pushups: this.pushupCount,
        distance: Number((this.distanceMeters / 1000).toFixed(2)),
        calories: Number(this.caloriesBurned.toFixed(1))
    });
}