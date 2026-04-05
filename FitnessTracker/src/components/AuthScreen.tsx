import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, useColorScheme, StyleSheet } from 'react-native';

import { login, signup } from '@/firebase/auth';

interface Props {
    onAuthSuccess: () => void;
}

const styles = StyleSheet.create({
    containerDark: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 24,
        backgroundColor: '#111827',
    },
    containerLight: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 24,
        backgroundColor: '#f9fafb',
    },
    cardDark: {
        borderRadius: 16,
        paddingHorizontal: 24,
        paddingVertical: 24,
        backgroundColor: '#1f2937',
    },
    cardLight: {
        borderRadius: 16,
        paddingHorizontal: 24,
        paddingVertical: 24,
        backgroundColor: '#ffffff',
    },
    titleDark: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 24,
        color: '#ffffff',
    },
    titleLight: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 24,
        color: '#111827',
    },
    errorText: {
        color: '#ef4444',
        textAlign: 'center',
        marginBottom: 16,
    },
    inputContainer: {
        gap: 16,
    },
    inputDark: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#374151',
        borderColor: '#4b5563',
        color: '#ffffff',
    },
    inputLight: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#ffffff',
        borderColor: '#d1d5db',
        color: '#111827',
    },
    buttonDark: {
        marginTop: 24,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: '#2563eb',
    },
    buttonLight: {
        marginTop: 24,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: '#3b82f6',
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: '500',
        textAlign: 'center',
    },
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
    },
    toggleTextDark: {
        color: '#9ca3af',
    },
    toggleTextLight: {
        color: '#6b7280',
    },
    toggleLinkDark: {
        fontWeight: '500',
        color: '#60a5fa',
    },
    toggleLinkLight: {
        fontWeight: '500',
        color: '#2563eb',
    },
});

export default function AuthScreen({ onAuthSuccess }: Props) {
    const isDark = useColorScheme() === 'dark';
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
            } else {
                await signup(email, password);
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
                        placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                    />
                    <TextInput
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        style={isDark ? styles.inputDark : styles.inputLight}
                        placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                    />
                </View>

                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={loading}
                    style={[
                        isDark ? styles.buttonDark : styles.buttonLight,
                        loading && styles.buttonDisabled,
                    ]}
                >
                    <Text style={styles.buttonText}>
                        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                    </Text>
                </TouchableOpacity>

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