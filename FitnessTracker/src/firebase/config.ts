import { initializeApp, getApps } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyCbsVunlJrgm3xvlB-IVOq3nPZWQ14i_2s",
    authDomain: "fitnesstracker-e1b70.firebaseapp.com",
    projectId: "fitnesstracker-e1b70",
    storageBucket: "fitnesstracker-e1b70.firebasestorage.app",
    messagingSenderId: "738153542500",
    appId: "1:738153542500:web:063b20dc10aed8945a0071",
    measurementId: "G-E4KCCY8BEG"
};

// Prevent re-initialization on hot reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Auth with AsyncStorage persistence so the session survives app restarts
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db = getFirestore(app);