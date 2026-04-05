import { useState, useEffect, SetStateAction } from 'react';
import { onAuthStateChange, logout as firebaseLogout } from '@/firebase/auth';
import { User } from 'firebase/auth';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChange((user: SetStateAction<User | null>) => {
            setUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const logout = async () => {
        try {
            await firebaseLogout();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return { user, loading, logout };
};