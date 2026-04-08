import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, useColorScheme, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { login, signup, resetPassword } from '@/firebase/auth';
import { useBiometricLogin } from '@/hooks/useBiometricLogin';

interface Props {
    onAuthSuccess: () => void;
}

const styles = StyleSheet.create({
    containerDark: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 40,
        backgroundColor: '#0f172a', // Deeper, richer dark background
    },
    containerLight: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 40,
        backgroundColor: '#f8fafc',
    },
    cardDark: {
        borderRadius: 24,
        paddingHorizontal: 28,
        paddingVertical: 32,
        backgroundColor: '#1e2937',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 12, // Android shadow
        borderWidth: 1,
        borderColor: '#334155',
    },
    cardLight: {
        borderRadius: 24,
        paddingHorizontal: 28,
        paddingVertical: 32,
        backgroundColor: '#ffffff',
        shadowColor: '#64748b',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    titleDark: {
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 32,
        color: '#f1f5f9',
        letterSpacing: -0.5,
    },
    titleLight: {
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 32,
        color: '#0f172a',
        letterSpacing: -0.5,
    },
    errorText: {
        color: '#f87171',
        textAlign: 'center',
        marginBottom: 20,
        fontSize: 14,
        fontWeight: '500',
    },
    inputContainer: {
        gap: 18,
    },
    inputDark: {
        borderWidth: 1.5,
        borderRadius: 12,
        paddingHorizontal: 18,
        paddingVertical: 14,
        backgroundColor: '#334155',
        borderColor: '#475569',
        color: '#e2e8f0',
        fontSize: 16,
    },
    inputLight: {
        borderWidth: 1.5,
        borderRadius: 12,
        paddingHorizontal: 18,
        paddingVertical: 14,
        backgroundColor: '#f8fafc',
        borderColor: '#cbd5e1',
        color: '#0f172a',
        fontSize: 16,
    },
    buttonDark: {
        marginTop: 28,
        paddingVertical: 15,
        borderRadius: 14,
        backgroundColor: '#3b82f6',
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    buttonLight: {
        marginTop: 28,
        paddingVertical: 15,
        borderRadius: 14,
        backgroundColor: '#2563eb',
        shadowColor: '#2563eb',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonDisabled: {
        opacity: 0.65,
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: '600',
        fontSize: 16.5,
        textAlign: 'center',
        letterSpacing: 0.3,
    },
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 28,
        gap: 4,
    },
    toggleTextDark: {
        color: '#94a3b8',
        fontSize: 14.5,
    },
    toggleTextLight: {
        color: '#64748b',
        fontSize: 14.5,
    },
    toggleLinkDark: {
        fontWeight: '600',
        color: '#60a5fa',
        fontSize: 14.5,
    },
    toggleLinkLight: {
        fontWeight: '600',
        color: '#2563eb',
        fontSize: 14.5,
    },
});

export default function AuthScreen({ onAuthSuccess }: Props) {
    const isDark = useColorScheme() === 'dark';
    const { isSupported, hasSavedCredentials, loading: bioLoading, saveCredentials, triggerBiometricLogin } = useBiometricLogin();
    
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleForgotPassword = async () => {
        if (!email) {
            Alert.alert('Email Required', 'Please enter your email address to reset your password.');
            return;
        }
        try {
            await resetPassword(email);
            Alert.alert('Email Sent', 'Check your inbox for password reset instructions.');
        } catch (e: any) {
            Alert.alert('Error', e.message || 'Failed to send reset email.');
        }
    };

    const handleBiometricLogin = async () => {
        setLoading(true);
        const { success, error } = await triggerBiometricLogin();
        if (success) {
            onAuthSuccess();
        } else if (error) {
            setError(error);
        }
        setLoading(false);
    };

    const handleSubmit = async () => {
        if (!email || !password) {
            setError('Email and password are required');
            return;
        }

        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                await login(email, password);
                await saveCredentials(email, password);
            } else {
                await signup(email, password);
                await saveCredentials(email, password);
            }
            onAuthSuccess();
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={isDark ? styles.containerDark : styles.containerLight}>
            <View style={isDark ? styles.cardDark : styles.cardLight}>
                <Text style={isDark ? styles.titleDark : styles.titleLight}>
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </Text>

                {error ? (
                    <Text style={styles.errorText}>{error}</Text>
                ) : null}

                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={isDark ? styles.inputDark : styles.inputLight}
                        placeholderTextColor={isDark ? '#94a3b8' : '#94a3b8'}
                    />
                    <TextInput
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        style={isDark ? styles.inputDark : styles.inputLight}
                        placeholderTextColor={isDark ? '#94a3b8' : '#94a3b8'}
                    />
                    
                    {isLogin && (
                        <TouchableOpacity style={{ alignSelf: 'flex-end', marginTop: -10 }} onPress={handleForgotPassword}>
                            <Text style={{ color: isDark ? '#60a5fa' : '#2563eb', fontSize: 13, fontWeight: '600' }}>Forgot Password?</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={loading}
                    activeOpacity={0.85}
                    style={[
                        isDark ? styles.buttonDark : styles.buttonLight,
                        loading && styles.buttonDisabled,
                    ]}
                >
                    <Text style={styles.buttonText}>
                        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                    </Text>
                </TouchableOpacity>

                {isLogin && isSupported && hasSavedCredentials && (
                    <TouchableOpacity
                        onPress={handleBiometricLogin}
                        disabled={loading || bioLoading}
                        style={{ marginTop: 20, alignItems: 'center', alignSelf: 'center', padding: 8 }}
                    >
                        {bioLoading ? (
                           <ActivityIndicator color={isDark ? '#e2e8f0' : '#0f172a'} />
                        ) : (
                           <Ionicons name="finger-print" size={42} color={isDark ? '#e2e8f0' : '#0f172a'} />
                        )}
                        <Text style={{ marginTop: 8, color: isDark ? '#94a3b8' : '#64748b', fontSize: 13, fontWeight: '500' }}>
                            Login with Biometrics
                        </Text>
                    </TouchableOpacity>
                )}

                <View style={styles.toggleContainer}>
                    <Text style={isDark ? styles.toggleTextDark : styles.toggleTextLight}>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                    </Text>
                    <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                        <Text style={isDark ? styles.toggleLinkDark : styles.toggleLinkLight}>
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}