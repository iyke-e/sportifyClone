import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useLocalSearchParams, usePathname, useRouter } from 'expo-router';
import Body from '@/component/layout/Body';
import SvgIconButton from '@/component/utilities/SvgIcons';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { handleTrackPress } from '@/lib/audioplayback/trackpress';
import {
    addTrackToPlaylist,
    fetchPlaylistById,
    fetchRecentlyPlayed,
    removeTrackFromPlaylist,
} from '@/lib/sportifyApi';

import PlaylistHeader from '../playlist/PlaylistHeader';
import PlaylistActions from '../playlist/PlaylistActions';
import PlaylistTrackList from '../playlist/PlaylistTrackList';
import PlaylistRecommendations from '../playlist/PlaylistRecommendations';
import PlaylistLoading from '../playlist/PlaylistLoading';

type Track = {
    id: string;
    name: string;
    image: string;
    artist?: string;
    title?: string;
    subtitle?: string;
    url?: string;
};

type Playlist = {
    id: string;
    title: string;
    image: string;
    tracks: Track[];
};

export default function PlaylistCreated() {
    const { playlistId } = useLocalSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const currentTab = pathname.split('/')[2] || 'home';

    const [playlist, setPlaylist] = useState<Playlist | null>(null);
    const [recommended, setRecommended] = useState<Track[]>([]);
    const [addedTrackIds, setAddedTrackIds] = useState<Set<string>>(new Set());

    const { play } = useAudioPlayer();

    useEffect(() => {
        if (typeof playlistId === 'string') {
            load(playlistId);
        }
    }, [playlistId]);

    const load = async (id: string) => {
        const playlistDetails = await fetchPlaylistById(id);
        setPlaylist(playlistDetails);

        const trackIds = new Set(playlistDetails.tracks.map((t: Track) => t.id));
        setAddedTrackIds(trackIds);

        const recent = await fetchRecentlyPlayed();
        const filtered: Track[] = recent
            .filter(item => !trackIds.has(item.id))
            .map(item => ({
                id: item.id,
                name: item.title,
                image: item.url,
                artist: item.subtitle ?? '',
            }));

        setRecommended(filtered);
    };

    const handleAddToPlaylist = async (trackId: string) => {
        if (typeof playlistId !== 'string') return;

        await addTrackToPlaylist(playlistId, trackId);
        setAddedTrackIds(prev => new Set(prev).add(trackId));

        const newTrack = recommended.find(t => t.id === trackId);
        if (!newTrack) return;

        const formattedTrack: Track = {
            id: newTrack.id,
            name: newTrack.title || '',
            image: newTrack.url || '',
            artist: newTrack.subtitle || '',
        };

        setPlaylist(prev => prev && ({
            ...prev,
            tracks: [...prev.tracks, formattedTrack],
        }));

        setRecommended(prev => prev.filter(t => t.id !== trackId));
    };

    const handleRemoveFromPlaylist = async (trackId: string) => {
        if (typeof playlistId !== 'string') return;

        await removeTrackFromPlaylist(playlistId, trackId);

        setPlaylist(prev => prev && ({
            ...prev,
            tracks: prev.tracks.filter(t => t.id !== trackId),
        }));

        const removed = playlist?.tracks.find(t => t.id === trackId);
        if (removed) {
            setRecommended(prev => [
                ...prev,
                {
                    id: removed.id,
                    name: removed.name,
                    image: removed.image,
                    artist: removed.artist,
                },
            ]);
        }

        setAddedTrackIds(prev => {
            const updated = new Set(prev);
            updated.delete(trackId);
            return updated;
        });
    };


    const hasTracks = !!playlist?.tracks?.length;

    if (!playlist) return <PlaylistLoading />;

    return (
        <Body>
            <PlaylistHeader
                playlist={playlist}
                hasTracks={hasTracks}
                onBack={() => router.back()}
            />

            {hasTracks ? (
                <PlaylistActions />
            ) : (
                <View style={styles.addButtonWrapper}>
                    <TouchableOpacity onPress={() => { }} style={styles.addButtonContainer}>
                        <SvgIconButton name="Plus" width={20} height={20} />
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Add Songs Here</Text>
                    </TouchableOpacity>
                </View>
            )}

            <ScrollView style={styles.songList}>
                <PlaylistTrackList
                    tracks={playlist.tracks}
                    currentTab={currentTab}
                    onPressTrack={({ item }) => handleTrackPress({ item, play })}
                    onRemoveTrack={handleRemoveFromPlaylist}
                />

                {currentTab === 'library' && (
                    <PlaylistRecommendations
                        recommended={recommended}
                        onAddToPlaylist={handleAddToPlaylist}
                        onPressTrack={({ item }) => handleTrackPress({ item, play })}
                    />
                )}
            </ScrollView>
        </Body>
    );
}

const styles = StyleSheet.create({
    songList: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#000000',
    },
    addButtonWrapper: {
        paddingHorizontal: 20,
        marginVertical: 16,
    },
    addButtonContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        width: 300,
        justifyContent: 'center',
        gap: 10,
        borderColor: '#fff',
        borderWidth: 1,
        borderRadius: 20,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 14,
    },
});
