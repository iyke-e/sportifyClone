import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import SvgIconButton from '@/component/utilities/SvgIcons';

export default function PlaylistRecommendations({
    recommended,
    onAddToPlaylist,
    onPressTrack,
}: {
    recommended: any[];
    onAddToPlaylist: (id: string) => void;
    onPressTrack: (params: any) => void;
}) {
    return (
        <>
            <Text style={styles.sectionTitle}>Recommended Songs</Text>
            {recommended.length === 0 ? (
                <Text style={styles.emptyText}>No recommendations available</Text>
            ) : (
                recommended.map(track => (
                    <View key={track.id} style={styles.trackRow}>
                        <TouchableOpacity
                            onPress={() => onPressTrack({ item: track })}
                            style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}
                        >
                            <Image source={{ uri: track.url }} style={styles.trackImage} />
                            <View style={styles.trackDetails}>
                                <Text style={styles.trackTitle} numberOfLines={1}>{track.title}</Text>
                                <Text style={styles.trackArtist} numberOfLines={1}>{track.subtitle}</Text>
                            </View>
                        </TouchableOpacity>
                        <SvgIconButton name="CirclePlus" onPress={() => onAddToPlaylist(track.id)} width={26} height={26} />
                    </View>
                ))
            )}
        </>
    );
}

const styles = StyleSheet.create({
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
    trackArtist: {
        color: '#aaa',
        fontSize: 13,
    },
});
