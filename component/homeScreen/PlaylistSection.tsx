import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Image,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { fetchPlaylistsBySearchTerm } from '@/lib/sportifyApi';

type PlaylistSectionProps = {
    title: string;
    searchTerm: string;
};

const PlaylistSection = ({ title, searchTerm }: PlaylistSectionProps) => {
    const [playlists, setPlaylists] = useState<
        { id: string; name: string; image: string }[]
    >([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchPlaylistsBySearchTerm(searchTerm);
                setPlaylists(data);
            } catch (err) {
                console.error('Failed to fetch playlists:', err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [searchTerm]);

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>

            {loading ? (
                <ActivityIndicator color="#1ED760" size="small" />
            ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {playlists.map((playlist, index) => (
                        <TouchableOpacity
                            key={playlist.id}
                            onPress={() =>
                                router.push({
                                    pathname: '/drawer/(tabs)/home/playlistdetails',
                                    params: { playlistId: playlist.id },
                                })
                            }
                            style={[styles.card, index === 0 && { marginLeft: 16 }]}
                        >
                            <Image source={{ uri: playlist.image }} style={styles.image} />
                            <Text style={styles.cardTitle} numberOfLines={1}>
                                {playlist.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
        </View>
    );
};

export default PlaylistSection;

const styles = StyleSheet.create({
    section: {
        marginVertical: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
        marginLeft: 16,
    },
    card: {
        width: 120,
        marginRight: 16,
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 8,
        marginBottom: 6,
    },
    cardTitle: {
        fontSize: 14,
        color: '#fff',
    },
});
