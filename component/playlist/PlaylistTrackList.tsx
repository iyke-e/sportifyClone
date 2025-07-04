import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import SvgIconButton from '@/component/utilities/SvgIcons';

export default function PlaylistTrackList({
    tracks,
    onPressTrack,
    onRemoveTrack,
    currentTab,
}: {
    tracks: any[];
    onPressTrack: (params: any) => void;
    onRemoveTrack: (id: string) => void;
    currentTab: string;
}) {
    return (
        <>
            {tracks.map((track, index) => (
                <View key={`${track.id}-${index}`} style={styles.trackRow}>
                    <TouchableOpacity
                        onPress={() => onPressTrack({
                            item: {
                                id: track.id,
                                title: track.name,
                                subtitle: track.artist,
                                url: track.image,
                                type: 'track'
                            }
                        })}
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
                    {currentTab === 'library' && (
                        <SvgIconButton name="CircleMinus" onPress={() => onRemoveTrack(track.id)} width={20} height={20} />
                    )}
                </View>
            ))}
        </>
    );
}

const styles = StyleSheet.create({
    trackRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 18,
        gap: 30,
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
});
