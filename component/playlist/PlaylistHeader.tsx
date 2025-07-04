import React from 'react';
import { View, Text, Image, TextInput, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import SvgIconButton from '@/component/utilities/SvgIcons';
import { Track } from '@/context/AudioPlayerContext';

export default function PlaylistHeader({
    hasTracks,
    playlist,
    onBack,
}: {
    hasTracks: boolean;
    playlist: any;
    onBack: () => void;
}) {
    return (
        <LinearGradient colors={['#1A2F45', '#000000']} style={styles.gradientHeader}>
            <View style={styles.header}>
                <SvgIconButton name="BackArrow" onPress={onBack} width={30} height={30} />
                {hasTracks && (
                    <View style={styles.searchContainer}>
                        <SvgIconButton name="Search" width={20} height={20} />
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
                        {playlist.tracks.slice(0, 4).map((track: Track, index: number) => (
                            <Image
                                key={track.id || index.toString()}
                                source={{ uri: track.image }}
                                style={styles.smallPlaylistImage}
                            />
                        ))}
                    </View>
                ) : (
                    <View style={styles.emptyCover}>
                        <SvgIconButton name="Music" width={80} height={80} disabled />
                    </View>
                )}
                <View style={styles.playlistInfo}>
                    <Text numberOfLines={3} style={styles.playlistTitle}>{playlist.title}</Text>
                    <Text style={styles.playlistStats}>
                        <Text style={styles.songCount}>{playlist.tracks.length} songs</Text>
                    </Text>
                </View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradientHeader: {
        paddingBottom: 15,
    },
    header: {
        paddingHorizontal: 15,
        paddingTop: 20,
        paddingBottom: 24,
        gap: 20,
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
    emptyCover: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        width: 140,
        height: 140,
        borderRadius: 8,
        marginRight: 15,
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
});
