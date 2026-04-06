import { useState, useEffect, useRef } from 'react';
import { MotionDetector } from '../../services/motionService';

export const useAutoTracker = () => {
    const [isTracking, setIsTracking] = useState(false);
    const [counts, setCounts] = useState({ steps: 0, pushups: 0 });
    const [motionData, setMotionData] = useState<any>(null);
    const detectorRef = useRef<MotionDetector>(new MotionDetector());

    useEffect(() => {
        return () => {
            if (detectorRef.current) {
                detectorRef.current.stopTracking();
            }
        };
    }, []);

    const startTracking = () => {
        const subscription = detectorRef.current.startTracking(setCounts);
        setIsTracking(true);
        return subscription;
    };

    const stopTracking = () => {
        detectorRef.current.stopTracking();
        setIsTracking(false);
    };

    const resetCounts = () => {
        detectorRef.current.resetCounts();
        setCounts({ steps: 0, pushups: 0 });
    };

    return {
        isTracking,
        counts,
        startTracking,
        stopTracking,
        resetCounts,
    };
};