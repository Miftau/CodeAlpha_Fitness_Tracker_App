import { Accelerometer, Gyroscope } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Thresholds for motion detection
const STEP_THRESHOLD = 0.5; // Adjust based on sensitivity needed
const PUSHUP_THRESHOLD = 1.0; // Higher acceleration for pushups

export class MotionDetector {
    private isTracking = false;
    private stepCount = 0;
    private pushupCount = 0;
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

    startTracking = (onData: (data: { steps: number; pushups: number }) => void) => {
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
        onData: (data: { steps: number; pushups: number }) => void
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
            this.lastAcceleration = acceleration;
        }

        // Detect pushups (more complex pattern matching needed)
        if (magnitude > PUSHUP_THRESHOLD && this.isLikelyPushup()) {
            this.pushupCount++;
            this.lastAcceleration = acceleration;
        }

        onData({ steps: this.stepCount, pushups: this.pushupCount });
    };

    private isLikelyPushup = (): boolean => {
        // Simple heuristic: check for consistent high-magnitude events
        const recentHighValues = this.accelerationHistory.filter(v => v > PUSHUP_THRESHOLD);
        return recentHighValues.length >= 3; // At least 3 high values in recent history
    };

    resetCounts = () => {
        this.stepCount = 0;
        this.pushupCount = 0;
        this.accelerationHistory = [];
    };

    getCounts = () => ({
        steps: this.stepCount,
        pushups: this.pushupCount,
    });
}