import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

const BIOMETRICS_KEY = '@fitness_biometrics_enabled';

export const useBiometrics = () => {
    const [isBiometricsEnabled, setIsBiometricsEnabled] = useState(false);
    const [isSupported, setIsSupported] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSupportAndLoadSetting = async () => {
            try {
                // 1. Check if device supports hardware biometrics
                const compatible = await LocalAuthentication.hasHardwareAsync();
                const enrolled = await LocalAuthentication.isEnrolledAsync();
                
                setIsSupported(compatible && enrolled);

                // 2. Load preferred setting
                const stored = await AsyncStorage.getItem(BIOMETRICS_KEY);
                if (stored === 'true') {
                    setIsBiometricsEnabled(true);
                }
            } catch (e) {
                console.error('Biometrics check error:', e);
            } finally {
                setLoading(false);
            }
        };

        checkSupportAndLoadSetting();
    }, []);

    const toggleBiometrics = async (enabled: boolean) => {
        try {
            await AsyncStorage.setItem(BIOMETRICS_KEY, enabled ? 'true' : 'false');
            setIsBiometricsEnabled(enabled);
            return true;
        } catch (e) {
            console.error('Failed to save biometrics setting:', e);
            return false;
        }
    };

    /**
     * Authenticates the user if biometrics are enabled.
     * Returns true if authenticated or if biometrics are disabled.
     * Returns false if authentication fails.
     */
    const authenticate = async (): Promise<boolean> => {
        if (!isSupported || !isBiometricsEnabled) return true;

        try {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Unlock Fitness Tracker',
                fallbackLabel: 'Use Device Passcode',
                cancelLabel: 'Cancel',
            });
            return result.success;
        } catch (e) {
            console.error('Biometric auth failed:', e);
            return false;
        }
    };

    return {
        isBiometricsEnabled,
        isSupported,
        loading,
        toggleBiometrics,
        authenticate
    };
};
