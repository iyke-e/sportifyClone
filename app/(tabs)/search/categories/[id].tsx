import React, { useEffect, useState } from 'react';
import { ScrollView, Text, Image, View, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { fetchPlaylistsBySearchTerm, Playlist } from '@/lib/sportifyApi';
import { TouchableOpacity } from 'react-native';

const CategoryDetail = () => {
    const { id } = useLocalSearchParams(); // id is the category name (e.g., "afro", "chill")
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter()

    useEffect(() => {
        if (id) {
            fetchPlaylistsBySearchTerm(id.toString()).then((data) => {
                setPlaylists(data);
                setLoading(false);
            });
        }
    }, [id]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator color="#fff" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.headerText}>{id?.toString().toUpperCase()}</Text>
            {playlists.map((playlist) => (
                <TouchableOpacity
                    key={playlist.id}
                    style={styles.card}
                    onPress={() => router.push({
                        pathname: '/(tabs)/search/playlistdetails',
                        params: { playlistId: playlist.id }
                    })}
                >
                    <Image source={{ uri: playlist.image }} style={styles.image} />
                    <Text style={styles.title}>{playlist.name}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

export default CategoryDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    card: {
        marginBottom: 20,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 12,
    },
    title: {
        color: '#fff',
        fontSize: 16,
        marginTop: 8,
    },
});
