import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { fetchPlaylistById, fetchRecentlyPlayed, addTrackToPlaylist, removeTrackFromPlaylist } from '@/lib/sportifyApi';
import { Ionicons } from '@expo/vector-icons';

type PlaylistTrack = {
    id: string;
    name: string;
    image: string;
    artist?: string;
};

export default function PlaylistCreated() {
    const { playlistId } = useLocalSearchParams();
    const router = useRouter();

    const [playlist, setPlaylist] = useState<{
        id: string;
        title: string;
        image: string;
        tracks: PlaylistTrack[];
    } | null>(null);

    const [recommended, setRecommended] = useState<any[]>([]);
    const [addedTrackIds, setAddedTrackIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (typeof playlistId === 'string') {
            load(playlistId);
        }
    }, [playlistId]);

    const load = async (id: string) => {
        const playlistDetails = await fetchPlaylistById(id);
        setPlaylist(playlistDetails);

        const trackIds = new Set(playlistDetails.tracks.map((t: any) => t.id));
        setAddedTrackIds(trackIds);

        const recent = await fetchRecentlyPlayed();
        const filtered = recent.filter(track => !trackIds.has(track.id));
        setRecommended(filtered);
    };

    const handleAddToPlaylist = async (trackId: string) => {
        if (typeof playlistId !== 'string') return;

        await addTrackToPlaylist(playlistId, trackId);
        setAddedTrackIds((prev: Set<string>) => new Set(prev).add(trackId));

        const newTrack = recommended.find(t => t.id === trackId);
        if (!newTrack) return;

        const formattedTrack: PlaylistTrack = {
            id: newTrack.id,
            name: newTrack.title,
            image: newTrack.url,
            artist: newTrack.subtitle ?? '',
        };

        setPlaylist(prev => ({
            ...prev!,
            tracks: [...prev!.tracks, formattedTrack],
        }));

        setRecommended(recommended.filter(t => t.id !== trackId));
    };

    const handleRemoveFromPlaylist = async (trackId: string) => {
        if (typeof playlistId !== 'string') return;

        await removeTrackFromPlaylist(playlistId, trackId);
        setPlaylist(prev => ({
            ...prev!,
            tracks: prev!.tracks.filter(t => t.id !== trackId),
        }));

        const removed = playlist?.tracks.find(t => t.id === trackId);
        if (removed) {
            setRecommended(prev => [...prev, {
                id: removed.id,
                title: removed.name,
                url: removed.image,
                subtitle: removed.artist
            }]);
        }

        setAddedTrackIds(prev => {
            const updated = new Set(prev);
            updated.delete(trackId);
            return updated;
        });
    };

    if (!playlist) return null;

    return (
        <ScrollView style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>

            {/* Header */}
            <View style={styles.header}>
                <Image source={{ uri: playlist.image }} style={styles.coverImage} />
                <Text style={styles.title}>{playlist.title}</Text>
            </View>

            {/* Tracks in Playlist */}
            <Text style={styles.sectionTitle}>Songs</Text>
            {playlist.tracks.length === 0 ? (
                <Text style={styles.emptyText}>No songs added yet</Text>
            ) : (
                playlist.tracks.map((track: PlaylistTrack) => (
                    <View key={track.id} style={styles.track}>
                        <TouchableOpacity
                            onPress={() => router.push({ pathname: '/(tabs)/library/songdetails', params: { trackId: track.id } })}
                            style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}
                        >
                            <Image source={{ uri: track.image }} style={styles.trackImage} />
                            <Text style={styles.trackTitle}>{track.name}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleRemoveFromPlaylist(track.id)}>
                            <Ionicons name="trash-outline" size={22} color="#f55" />
                        </TouchableOpacity>
                    </View>
                ))
            )}

            {/* Recommended Songs */}
            <Text style={styles.sectionTitle}>Recommended</Text>
            {recommended.length === 0 ? (
                <Text style={styles.emptyText}>No recommendations available</Text>
            ) : (
                recommended.map(track => (
                    <View key={track.id} style={styles.track}>
                        <TouchableOpacity
                            onPress={() => router.push({ pathname: '/(tabs)/library/songdetails', params: { trackId: track.id } })}
                            style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}
                        >
                            <Image source={{ uri: track.url }} style={styles.trackImage} />
                            <Text style={styles.trackTitle}>{track.title}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleAddToPlaylist(track.id)} style={styles.addButton}>
                            <Text style={styles.addButtonText}>Add</Text>
                        </TouchableOpacity>
                    </View>
                ))
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000',
        flex: 1,
        paddingHorizontal: 16,
    },
    backBtn: {
        position: 'absolute',
        top: 50,
        left: 16,
        zIndex: 99,
    },
    header: {
        alignItems: 'center',
        marginTop: 80,
        marginBottom: 24,
    },
    coverImage: {
        width: 200,
        height: 200,
        borderRadius: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 16,
        textAlign: 'center',
    },
    sectionTitle: {
        color: '#aaa',
        fontSize: 18,
        fontWeight: '600',
        marginTop: 24,
        marginBottom: 12,
    },
    emptyText: {
        color: '#555',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 12,
    },
    track: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    trackImage: {
        width: 50,
        height: 50,
        borderRadius: 6,
        marginRight: 12,
    },
    trackTitle: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
    },
    addButton: {
        backgroundColor: '#1DB954',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    addButtonText: {
        color: '#000',
        fontWeight: 'bold',
    },
});
