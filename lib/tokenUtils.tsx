import AsyncStorage from '@react-native-async-storage/async-storage';

export const isTokenValid = async (): Promise<boolean> => {
    const expiresAtStr = await AsyncStorage.getItem('spotify_expires_at');
    if (!expiresAtStr) return false;

    const expiresAt = parseInt(expiresAtStr, 10);
    return Date.now() < expiresAt;
};

export const getStoredToken = async (): Promise<string | null> => {
    const valid = await isTokenValid();
    if (!valid) return null;

    return await AsyncStorage.getItem('spotify_access_token');
};

export const getRawToken = async (): Promise<string | null> => {
    return await AsyncStorage.getItem('spotify_access_token');
};
