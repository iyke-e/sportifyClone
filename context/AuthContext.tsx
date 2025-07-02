import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        (async () => {
            const token = await AsyncStorage.getItem('spotify_access_token');
            setIsLoggedIn(!!token);
            setIsLoading(false);
        })();
    }, []);

    const logout = async () => {
        await AsyncStorage.removeItem('spotify_access_token');
        setIsLoggedIn(false);
        console.log('Logged out');
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, isLoading, logout, setLoggedIn: setIsLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};
