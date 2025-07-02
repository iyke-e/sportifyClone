import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { fetchPlaylistById, fetchRecentlyPlayed, addTrackToPlaylist, removeTrackFromPlaylist } from '@/lib/sportifyApi';
import { LinearGradient } from 'expo-linear-gradient';
import Body from '@/component/layout/Body';
import { Svg } from '@/assets';

export default function PlaylistCreated() {
    const { playlistId } = useLocalSearchParams();
    const router = useRouter();

    const [playlist, setPlaylist] = useState<{
        id: string;
        title: string;
        image: string;
        tracks: {
            id: string;
            name: string;
            image: string;
            artist?: string;
        }[];
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
        setAddedTrackIds(prev => new Set(prev).add(trackId));

        const newTrack = recommended.find(t => t.id === trackId);
        if (!newTrack) return;

        const formattedTrack = {
            id: newTrack.id,
            name: newTrack.title,
            image: newTrack.url,
            artist: newTrack.subtitle ?? '',
        };

        setPlaylist(prev => ({
            ...prev!,
            tracks: [...prev!.tracks, formattedTrack],
        }));

        setRecommended(prev => prev.filter(t => t.id !== trackId));
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
            setRecommended(prev => [
                ...prev,
                {
                    id: removed.id,
                    title: removed.name,
                    url: removed.image,
                    subtitle: removed.artist
                }
            ]);
        }

        setAddedTrackIds(prev => {
            const updated = new Set(prev);
            updated.delete(trackId);
            return updated;
        });
    };

    if (!playlist) {
        return (
            <View style={styles.loaderContainer}>
                <Text style={{ color: '#aaa' }}>Loading...</Text>
            </View>
        );
    }

    const hasTracks = playlist.tracks.length > 0;

    return (
        <Body>
            <LinearGradient colors={['#1A2F45', '#121212']} style={styles.gradientHeader}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Svg.BackArrow width={30} height={30} />
                    </TouchableOpacity>
                    {hasTracks && (
                        <View style={styles.searchContainer}>
                            <Svg.Search width={20} height={20} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Find in playlist"
                                placeholderTextColor="#ccc"
                            />
                        </View>
                    )}
                </View>

                <View style={styles.playlistSummary}>
                    {hasTracks ? (
                        <View style={styles.playlistImageGrid}>
                            {playlist.tracks.slice(0, 4).map((track, index) => (
                                <Image
                                    key={track.id || index.toString()}
                                    source={{ uri: track.image }}
                                    style={styles.smallPlaylistImage}
                                />
                            ))}
                        </View>
                    ) : (
                        <View style={
                            {
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: "rgba(0,0,0,0.4)",
                                width: 140,
                                height: 140,
                                borderRadius: 8,
                                marginRight: 15

                            }}>
                            <Svg.Music width={80} height={80} />
                        </View>
                    )}

                    <View style={styles.playlistInfo}>
                        <Text style={styles.playlistTitle}>{playlist.title}</Text>
                        <Text style={styles.playlistStats}>
                            <Text style={styles.songCount}>{playlist.tracks.length} songs</Text>
                        </Text>
                    </View>
                </View>

                {hasTracks ? (
                    <View style={styles.actionsRow}>
                        <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
                            <Svg.CircleDownload width={24} height={24} />
                            <Svg.AddUser width={24} height={24} />
                            <Svg.Share width={24} height={24} />
                            <Svg.Threedot width={24} height={24} />
                        </View>

                        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                            <Svg.Shuffle width={30} height={30} />
                            <TouchableOpacity style={styles.playButton}>
                                <Svg.PlayBlack width={20} height={20} />
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View style={{ paddingHorizontal: 20, marginVertical: 16 }}>

                        <TouchableOpacity
                            onPress={() => { }}
                            style={styles.addButtonContainer}
                        >
                            <Svg.Plus width={20} height={20} />
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Add Songs</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </LinearGradient>

            <ScrollView style={styles.songList}>
                {playlist.tracks.map(track => (
                    <View key={track.id} style={styles.trackRow}>
                        <TouchableOpacity
                            onPress={() => router.push({ pathname: '/(tabs)/search/songdetails', params: { trackId: track.id } })}
                            style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}
                        >
                            <Image source={{ uri: track.image }} style={styles.trackImage} />
                            <View style={styles.trackDetails}>
                                <Text style={styles.trackTitle} numberOfLines={1}>{track.name}</Text>
                                <View style={styles.trackSubtitle}>
                                    <Text style={styles.trackVideoTag}>Artist</Text>
                                    <Text style={styles.trackArtist} numberOfLines={1}>{track.artist}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleRemoveFromPlaylist(track.id)} >
                            <Svg.Delete width={20} height={20} />
                        </TouchableOpacity>
                    </View>
                ))}

                <Text style={styles.sectionTitle}>Recommended Songs</Text>
                {recommended.length === 0 ? (
                    <Text style={styles.emptyText}>No recommendations available</Text>
                ) : (
                    recommended.map(track => (
                        <View key={track.id} style={styles.trackRow}>
                            <TouchableOpacity
                                onPress={() => router.push({ pathname: '/(tabs)/search/songdetails', params: { trackId: track.id } })}
                                style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}
                            >
                                <Image source={{ uri: track.url }} style={styles.trackImage} />
                                <View style={styles.trackDetails}>
                                    <Text style={styles.trackTitle} numberOfLines={1}>{track.title}</Text>
                                    <Text style={styles.trackArtist} numberOfLines={1}>{track.subtitle}</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleAddToPlaylist(track.id)} >
                                <Svg.CirclePlus width={26} height={26} />
                            </TouchableOpacity>
                        </View>
                    ))
                )}
            </ScrollView>
        </Body>
    );
}

const styles = StyleSheet.create({
    addButtonContainer: {
        flexDirection: "row",
        alignSelf: "center", width: 300,
        justifyContent: "center",
        gap: 10, borderColor: '#fff',
        borderWidth: 1,
        borderRadius: 20,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 14
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212',
    },
    gradientHeader: {
        paddingBottom: 15,
    },
    header: {
        paddingHorizontal: 15,
        paddingTop: 20,
        paddingBottom: 24,
        gap: 20
    },
    backButton: {
        marginRight: 10,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 8,
        paddingHorizontal: 20,
        flex: 1,
        height: 46,
    },
    searchInput: {
        color: '#fff',
        marginLeft: 8,
        flex: 1,
    },
    playlistSummary: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    playlistImageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: 140,
        height: 140,
        marginRight: 15,
        borderRadius: 8,
        overflow: 'hidden',
    },
    smallPlaylistImage: {
        width: '50%',
        height: '50%',
    },
    playlistInfo: {
        flex: 1,
    },
    playlistTitle: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
    },
    playlistStats: {
        color: '#aaa',
        fontSize: 13,
        marginTop: 5,
    },
    songCount: {
        fontWeight: 'bold',
        color: '#fff',
    },
    actionsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 20,
        paddingHorizontal: 20
    },
    playButton: {
        backgroundColor: '#1ED760',
        width: 56,
        height: 56,
        borderRadius: 300,
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center"
    },
    songList: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#121212',
    },
    trackRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 18,
        gap: 30
    },
    trackImage: {
        width: 52,
        height: 52,
        borderRadius: 4,
        marginRight: 12,
    },
    trackDetails: {
        flex: 1,
    },
    trackTitle: {
        color: '#fff',
        fontSize: 16,
    },
    trackSubtitle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    trackVideoTag: {
        backgroundColor: 'rgba(243, 243, 243, 0.1)',
        color: '#aaa',
        fontSize: 10,
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 3,
        marginRight: 5,
        fontWeight: 'bold',
    },
    trackArtist: {
        color: '#aaa',
        fontSize: 13,
    },
    addButtonText: {
        color: '#000',
        fontWeight: 'bold',
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '600',
        marginTop: 24,
        marginBottom: 20,
    },
    emptyText: {
        color: '#555',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 12,
    },
});
