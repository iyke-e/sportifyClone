import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isTokenValid } from '@/lib/tokenUtils';

type AuthContextType = {
    isLoggedIn: boolean;
    isLoading: boolean;
    logout: () => Promise<void>;
    setLoggedIn: (state: boolean) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkToken = async () => {
            const valid = await isTokenValid();
            setIsLoggedIn(valid);
            setIsLoading(false);
        };

        checkToken();
    }, []);

    const logout = async () => {
        await AsyncStorage.multiRemove([
            'spotify_access_token',
            'spotify_expires_at',
            'spotify_refresh_token',
        ]);
        setIsLoggedIn(false);
        console.log('Logged out');
    };

    return (
        <AuthContext.Provider
            value={{ isLoggedIn, isLoading, logout, setLoggedIn: setIsLoggedIn }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
