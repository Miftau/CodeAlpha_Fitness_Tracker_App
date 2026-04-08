import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import { useState, useEffect } from 'react';
import { login } from '@/firebase/auth';

const CREDENTIALS_KEY = '@fitness_secure_credentials';

export const useBiometricLogin = () => {
    const [hasSavedCredentials, setHasSavedCredentials] = useState(false);
    const [isSupported, setIsSupported] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkBiometricLoginStatus = async () => {
            try {
                const compatible = await LocalAuthentication.hasHardwareAsync();
                const enrolled = await LocalAuthentication.isEnrolledAsync();
                setIsSupported(compatible && enrolled);

                // Check if credentials exist in SecureStore
                const creds = await SecureStore.getItemAsync(CREDENTIALS_KEY);
                setHasSavedCredentials(!!creds);
            } catch (e) {
                console.error('Biometric status check failed: ', e);
            } finally {
                setLoading(false);
            }
        };
        checkBiometricLoginStatus();
    }, []);

    // Encrypt and save credentials (usually called after a successful manual password login)
    const saveCredentials = async (email: string, pass: string) => {
        if (!isSupported) return;
        try {
            const data = JSON.stringify({ email, pass });
            await SecureStore.setItemAsync(CREDENTIALS_KEY, data);
            setHasSavedCredentials(true);
        } catch (e) {
            console.error('Failed to securely stash credentials: ', e);
        }
    };

    const clearCredentials = async () => {
        try {
            await SecureStore.deleteItemAsync(CREDENTIALS_KEY);
            setHasSavedCredentials(false);
        } catch (e) {
            console.error('Failed to clear credentials: ', e);
        }
    };

    /**
     * Executes Native Biometrics prompt. If successful, pulls decrypted
     * password from Keychain/Keystore and automatically signs in Firebase!
     */
    const triggerBiometricLogin = async (): Promise<{ success: boolean; error?: string }> => {
        if (!isSupported || !hasSavedCredentials) {
            return { success: false, error: 'Biometrics unavailable or no saved credentials.' };
        }

        try {
            const authResult = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Login to Fitness Tracker',
                fallbackLabel: 'Use Device Passcode',
                cancelLabel: 'Cancel',
            });

            if (authResult.success) {
                const credsStr = await SecureStore.getItemAsync(CREDENTIALS_KEY);
                if (!credsStr) return { success: false, error: 'Credentials corrupted.' };

                const { email, pass } = JSON.parse(credsStr);
                
                // Directly login using the securely fetched password
                await login(email, pass);
                return { success: true };
            } else {
                return { success: false, error: 'Biometric scan failed or cancelled.' };
            }
        } catch (e: any) {
            return { success: false, error: e.message || 'Authentication error.' };
        }
    };

    return {
        isSupported,
        hasSavedCredentials,
        loading,
        saveCredentials,
        clearCredentials,
        triggerBiometricLogin,
    };
};
