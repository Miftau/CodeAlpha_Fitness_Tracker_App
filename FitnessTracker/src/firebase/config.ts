import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ⚠️ Replace with your Firebase project config
const firebaseConfig = {
    apiKey: "AIzaSyCbsVunlJrgm3xvlB-IVOq3nPZWQ14i_2s",
    authDomain: "fitnesstracker-e1b70.firebaseapp.com",
    projectId: "fitnesstracker-e1b70",
    storageBucket: "fitnesstracker-e1b70.firebasestorage.app",
    messagingSenderId: "738153542500",
    appId: "1:738153542500:web:063b20dc10aed8945a0071",
    measurementId: "G-E4KCCY8BEG"
};

// Prevent re-initialization
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);

// Enable offline persistence
import { enableIndexedDbPersistence } from 'firebase/firestore';
enableIndexedDbPersistence(db).catch(err => console.error("Persistance failed:", err));