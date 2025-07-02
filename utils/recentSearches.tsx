import AsyncStorage from '@react-native-async-storage/async-storage';
import { SpotifyResult } from '@/lib/sportifyApi';

const STORAGE_KEY = 'recent_spotify_results';
const MAX_RECENT = 10;

export const getRecentSearches = async (): Promise<SpotifyResult[]> => {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
};

export const saveSearchItem = async (item: SpotifyResult) => {
    const existing = await getRecentSearches();

    const filtered = existing.filter((i) => i.id !== item.id);
    const updated = [item, ...filtered].slice(0, MAX_RECENT);

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const clearRecentSearches = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
};
