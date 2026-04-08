import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Switch,
  ScrollView, StyleSheet, SafeAreaView, useColorScheme, Alert, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { useBiometrics } from '@/hooks/useBiometrics';
import { useBiometricLogin } from '@/hooks/useBiometricLogin';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { 
  enableDailyReminders, 
  disableDailyReminders, 
  getNotificationPreference 
} from '@/services/notificationService';

export default function SettingsScreen() {
  const isDark = useColorScheme() === 'dark';
  // Auth
  const { user, logout } = useAuth();
  
  // Biometrics
  const { isBiometricsEnabled, isSupported, toggleBiometrics, loading: bioLoading } = useBiometrics();
  
  // Biometric Auth (for logout clearing)
  const { clearCredentials } = useBiometricLogin();

  // States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPwd, setIsChangingPwd] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    // Load local notification preference on mount
    getNotificationPreference().then(pref => {
        setNotificationsEnabled(pref);
    });
  }, []);

  // --- Handlers ---
  const handlePasswordChange = async () => {
    if (!currentPassword) {
      Alert.alert('Required', 'Please enter your current password.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      Alert.alert('Invalid Password', 'New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Mismatch', 'New passwords do not match.');
      return;
    }

    if (!user || !user.email) return;
    
    setIsChangingPwd(true);
    try {
      // 1. Re-authenticate user with Current Password
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // 2. Actually update password
      await updatePassword(user, newPassword);

      Alert.alert('Success', 'Your password has been securely updated.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (e: any) {
      if (e.code === 'auth/invalid-credential') {
         Alert.alert('Authentication Failed', 'Your current password is incorrect.');
      } else {
         Alert.alert('Error', e.message || 'Failed to update password.');
      }
    } finally {
      setIsChangingPwd(false);
    }
  };

  const handleToggleBiometrics = async (val: boolean) => {
    const success = await toggleBiometrics(val);
    if (!success) {
      Alert.alert('Error', 'Failed to save biometric settings.');
    }
  };

  const handleToggleNotifications = async (val: boolean) => {
    if (val) {
        const success = await enableDailyReminders();
        if (success) {
            setNotificationsEnabled(true);
            Alert.alert('Notifications Enabled', 'You will be reminded daily at 6:00 PM.');
        } else {
            Alert.alert('Permission Denied', 'Please enable notifications in your device settings.');
            setNotificationsEnabled(false);
        }
    } else {
        await disableDailyReminders();
        setNotificationsEnabled(false);
    }
  };

  const handleLogout = async () => {
     await clearCredentials(); // Wipe standard biometric cached password
     await logout();
  };

  // --- Palette ---
  const bg     = isDark ? '#0d1117' : '#f0f4ff';
  const card   = isDark ? '#1c2333' : '#ffffff';
  const text   = isDark ? '#f1f5f9' : '#0f172a';
  const sub    = isDark ? '#64748b' : '#94a3b8';
  const border = isDark ? '#1e293b' : '#e2e8f0';
  const surf   = isDark ? '#252d3d' : '#f8faff';

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: bg },
    page: { padding: 20 },
    sectionLabel: { fontSize: 13, fontWeight: '700', color: sub, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, marginLeft: 4, marginTop: 16 },
    card: { backgroundColor: card, borderRadius: 18, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: border },
    
    // Form Inputs
    inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: surf, borderRadius: 12, borderWidth: 1, borderColor: border, paddingHorizontal: 14, marginBottom: 12 },
    inputIcon: { marginRight: 10 },
    input: { flex: 1, paddingVertical: 14, fontSize: 15, color: text },
    btn: { backgroundColor: '#6366f1', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 4 },
    btnText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
    
    // Toggles
    row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 6 },
    rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    rowIconWrap: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    rowTitle: { fontSize: 16, fontWeight: '600', color: text },
    rowSub: { fontSize: 12, color: sub, marginTop: 2 },
    
    // Logout
    logoutBtn: { backgroundColor: isDark ? '#3f1a1d' : '#fee2e2', borderRadius: 18, paddingVertical: 16, alignItems: 'center', marginTop: 20, marginBottom: 40, borderWidth: 1, borderColor: isDark ? '#7f1d1d' : '#fca5a5' },
    logoutText: { color: '#ef4444', fontSize: 16, fontWeight: '700' }
  });

  return (
    <SafeAreaView style={s.container}>
      <ScrollView contentContainerStyle={s.page}>

        <Text style={s.sectionLabel}>Security</Text>
        <View style={s.card}>
          <View style={s.inputWrap}>
            <Ionicons name="key-outline" size={18} color={sub} style={s.inputIcon} />
            <TextInput
              style={s.input}
              placeholder="Current Password"
              placeholderTextColor={sub}
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
          </View>
          <View style={s.inputWrap}>
            <Ionicons name="lock-closed-outline" size={18} color={sub} style={s.inputIcon} />
            <TextInput
              style={s.input}
              placeholder="New Password"
              placeholderTextColor={sub}
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
          </View>
          <View style={s.inputWrap}>
            <Ionicons name="checkmark-circle-outline" size={18} color={sub} style={s.inputIcon} />
            <TextInput
              style={s.input}
              placeholder="Confirm Password"
              placeholderTextColor={sub}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>
          <TouchableOpacity style={s.btn} onPress={handlePasswordChange} disabled={isChangingPwd}>
            {isChangingPwd ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Change Password</Text>}
          </TouchableOpacity>
        </View>

        <Text style={s.sectionLabel}>Preferences</Text>
        <View style={s.card}>
          {/* Biometrics */}
          <View style={s.row}>
            <View style={s.rowLeft}>
              <View style={[s.rowIconWrap, { backgroundColor: isDark ? '#1e3a8a' : '#dbeafe' }]}>
                <Ionicons name="finger-print" size={20} color="#3b82f6" />
              </View>
              <View>
                <Text style={s.rowTitle}>Biometrics Login</Text>
                <Text style={s.rowSub}>
                  {isSupported ? 'Require FaceID / TouchID' : 'Hardware not supported'}
                </Text>
              </View>
            </View>
            {bioLoading ? (
               <ActivityIndicator color="#6366f1" />
            ) : (
               <Switch 
                 value={isBiometricsEnabled} 
                 onValueChange={handleToggleBiometrics} 
                 disabled={!isSupported}
                 trackColor={{ false: border, true: '#818cf8' }}
                 thumbColor={isBiometricsEnabled ? '#6366f1' : '#cbd5e1'}
               />
            )}
          </View>

          <View style={{ height: 1, backgroundColor: border, marginVertical: 14 }} />

          {/* Notifications */}
          <View style={s.row}>
            <View style={s.rowLeft}>
              <View style={[s.rowIconWrap, { backgroundColor: isDark ? '#78350f' : '#fef3c7' }]}>
                <Ionicons name="notifications" size={20} color="#f59e0b" />
              </View>
              <View>
                <Text style={s.rowTitle}>Daily Reminders</Text>
                <Text style={s.rowSub}>Get notified at 6:00 PM</Text>
              </View>
            </View>
            <Switch 
              value={notificationsEnabled} 
              onValueChange={handleToggleNotifications} 
              trackColor={{ false: border, true: '#fcd34d' }}
              thumbColor={notificationsEnabled ? '#f59e0b' : '#cbd5e1'}
            />
          </View>
        </View>

        <TouchableOpacity style={s.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <Text style={s.logoutText}>Sign Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}
