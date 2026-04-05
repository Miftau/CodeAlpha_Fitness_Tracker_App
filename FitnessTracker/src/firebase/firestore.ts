import { db } from './config';
import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    orderBy,
    serverTimestamp,
    doc,
    updateDoc,
    deleteDoc,
    getDoc,
} from 'firebase/firestore';
import { Activity, DailySummary } from './types';

// Generate unique ID manually (instead of nanoid)
const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

// Activity Operations
export const addActivity = async (userId: string, activity: Omit<Activity, 'id' | 'userId' | 'createdAt'>) => {
    try {
        const docRef = await addDoc(collection(db, 'activities'), {
            ...activity,
            userId,
            createdAt: serverTimestamp(),
        });
        // Return with generated ID and timestamp
        return {
            id: docRef.id,
            ...activity,
            userId,
            createdAt: new Date().toISOString() // fallback timestamp
        };
    } catch (error) {
        console.error('Error adding activity:', error);
        throw error;
    }
};

export const getActivitiesByDate = async (userId: string, date: string) => {
    try {
        const q = query(
            collection(db, 'activities'),
            where('userId', '==', userId),
            where('date', '==', date),
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Activity));
    } catch (error) {
        console.error('Error fetching activities:', error);
        return [];
    }
};

export const getActivitiesByRange = async (userId: string, startDate: string, endDate: string) => {
    try {
        const q = query(
            collection(db, 'activities'),
            where('userId', '==', userId),
            where('date', '>=', startDate),
            where('date', '<=', endDate),
            orderBy('date', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Activity));
    } catch (error) {
        console.error('Error fetching range activities:', error);
        return [];
    }
};

// Daily Summary Operations
export const getDailySummary = async (userId: string, date: string) => {
    try {
        const docRef = doc(db, 'dailySummaries', `${userId}_${date}`);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? {
            id: docSnap.id,
            ...docSnap.data()
        } as unknown as DailySummary : null;
    } catch (error) {
        console.error('Error fetching daily summary:', error);
        return null;
    }
};

export const upsertDailySummary = async (userId: string, summary: Omit<DailySummary, 'userId' | 'createdAt'>) => {
    try {
        const docRef = doc(db, 'dailySummaries', `${userId}_${summary.date}`);
        await updateDoc(docRef, {
            ...summary,
            userId,
            createdAt: serverTimestamp(),
        });
    } catch (error) {
        console.error('Error updating daily summary:', error);
        throw error;
    }
};