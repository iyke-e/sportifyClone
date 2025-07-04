import { useState, useEffect, useCallback } from 'react';
import {
    View,
    TextInput,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Image,
    ScrollView,
} from 'react-native';
import { Svg } from '@/assets';
import Body from '@/component/layout/Body';
import { useRouter } from 'expo-router';

import {
    getRecentSearches,
    saveSearchItem,
    clearRecentSearches,
} from '@/utils/recentSearches';

import { searchSpotify, SpotifyResult } from '@/lib/sportifyApi';
import { debounce } from '@/utils/debounce';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SpotifyResult[]>([]);
    const [recent, setRecent] = useState<SpotifyResult[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        (async () => setRecent(await getRecentSearches()))();
    }, []);

    const performSearch = async (text: string) => {
        if (!text.trim()) return;
        setLoading(true);
        try {
            const res = await searchSpotify(text);
            setResults(res);
        } catch (err) {
            console.error(err);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const debouncedSearch = useCallback(
        debounce((text: string) => performSearch(text), 500),
        []
    );

    const onChangeText = (text: string) => {
        setQuery(text);
        if (text.trim() === '') {
            setResults([]);
            setLoading(false);
            return;
        }
        debouncedSearch(text);
    };

    const onItemSelect = async (item: SpotifyResult) => {
        await saveSearchItem(item);
        setRecent(await getRecentSearches());

        switch (item.type) {
            case 'track':
                router.push({
                    pathname: '/drawer/(tabs)/search/songdetails',
                    params: { trackId: item.id },
                });
                break;
            case 'album':
                router.push({
                    pathname: '/drawer/(tabs)/search/albumdetails',
                    params: { albumId: item.id },
                });
                break;
            case 'artist':
                router.push({
                    pathname: '/drawer/(tabs)/search/artistdetails',
                    params: { artistId: item.id },
                });
                break;
            case 'playlist':
                router.push({
                    pathname: '/drawer/(tabs)/search/playlistdetails',
                    params: { playlistId: item.id },
                });
                break;
        }
    };

    const onRecentPress = (item: SpotifyResult) => {
        setQuery(item.name);
        performSearch(item.name);
    };

    const removeSingleRecent = async (id: string) => {
        const updated = recent.filter((item) => item.id !== id);
        await AsyncStorage.setItem('recent_spotify_results', JSON.stringify(updated));
        setRecent(updated);
    };

    return (
        <Body>
            <View style={styles.searchRow}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Svg.BackArrow width={24} height={24} />
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    placeholder="What do you want to listen to"
                    placeholderTextColor="#888"
                    value={query}
                    onChangeText={onChangeText}
                    autoCorrect={false}
                />
                {query !== '' && (
                    <TouchableOpacity onPress={() => { setQuery(''); setResults([]); }}>
                        <Svg.Close width={18} height={18} />
                    </TouchableOpacity>
                )}
            </View>

            {loading && <ActivityIndicator size="small" color="#1DB954" style={{ margin: 10 }} />}

            {query.trim() === '' && recent.length > 0 && (
                <View style={{ marginBottom: 20, paddingHorizontal: 16 }}>
                    <Text style={styles.label}>Recent searches</Text>
                    {recent.map((item, i) => (
                        <View key={i} style={styles.recentRow}>
                            <TouchableOpacity
                                onPress={() => onRecentPress(item)}
                                style={styles.card}
                            >
                                {item.albumImageUrl ? (
                                    <Image source={{ uri: item.albumImageUrl }} style={styles.image} />
                                ) : (
                                    <View style={styles.placeholderImage} />
                                )}
                                <View style={styles.cardText}>
                                    <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
                                    <Text style={styles.subtitle}>{item.type}</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => removeSingleRecent(item.id)}>
                                <Svg.Close width={18} height={18} />
                            </TouchableOpacity>
                        </View>
                    ))}
                    <TouchableOpacity
                        onPress={async () => {
                            await clearRecentSearches();
                            setRecent([]);
                        }}
                    >
                        <Text style={styles.clearBtn}>Clear recent</Text>
                    </TouchableOpacity>
                </View>
            )}

            <ScrollView contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 16 }}>
                {query.trim() &&
                    results.map((item) => (
                        <TouchableOpacity
                            key={`${item.type}-${item.id}`}
                            style={{ marginBottom: 5 }}
                            onPress={() => onItemSelect(item)}
                        >
                            <View style={styles.card}>
                                {item.albumImageUrl ? (
                                    <Image source={{ uri: item.albumImageUrl }} style={styles.image} />
                                ) : (
                                    <View style={styles.placeholderImage} />
                                )}
                                <View style={styles.cardText}>
                                    <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
                                    <Text style={styles.subtitle}>{item.type}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
            </ScrollView>
        </Body>
    );
}

const CARD_HEIGHT = 62;
const IMAGE_SIZE = 56;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'black', padding: 16 },
    searchRow: {
        flexDirection: 'row',
        gap: 10,
        height: 60,
        alignItems: 'center',
        backgroundColor: '#121212',
        borderRadius: 6,
        paddingHorizontal: 15,
        marginBottom: 10,
    },
    input: {
        flex: 1,
        color: 'white',
        paddingVertical: 12,
    },
    label: {
        color: 'white',
        fontSize: 20,
        marginBottom: 8,
        fontWeight: '800',
    },
    recentRow: {
        flexDirection: 'row',
        gap: 25,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    clearBtn: { color: '#1DB954', marginTop: 6 },
    card: { flexDirection: 'row', alignItems: 'center', height: CARD_HEIGHT, flex: 1 },
    image: { width: IMAGE_SIZE, height: IMAGE_SIZE, marginRight: 12 },
    placeholderImage: { width: IMAGE_SIZE, height: IMAGE_SIZE, backgroundColor: '#333', borderRadius: 4, marginRight: 12 },
    cardText: { flex: 1, justifyContent: 'center' },
    title: { color: 'white', fontSize: 16 },
    subtitle: { color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 2 },
});
