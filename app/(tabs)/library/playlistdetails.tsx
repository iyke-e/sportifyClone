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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { fetchPlaylistById } from '@/lib/sportifyApi';
import { LinearGradient } from 'expo-linear-gradient';
import { Entypo } from '@expo/vector-icons';
import Body from '@/component/layout/Body';

const PlaylistDetails = () => {
    const { playlistId } = useLocalSearchParams<{ playlistId: string }>();
    const router = useRouter();
    const [playlist, setPlaylist] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (playlistId) {
            fetchPlaylistById(playlistId).then((data) => {
                setPlaylist(data);
                setLoading(false);
            });
        }
    }, [playlistId]);

    if (loading || !playlist) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator color="#1ED760" size="large" />
            </View>
        );
    }

    return (
        <Body >
            <LinearGradient
                colors={['#1A2F45', '#121212', '#000']}
                style={styles.gradient}
            >
                <Image source={{ uri: playlist.image }} style={styles.playlistImage} />
                <Text style={styles.playlistTitle}>{playlist.title}</Text>
                <Text style={styles.songCount}>{playlist.tracks.length} songs</Text>
            </LinearGradient>

            <View style={styles.songList}>
                {playlist.tracks.map((track: any, index: number) => (
                    <TouchableOpacity
                        key={track.id + index}
                        style={styles.trackRow}
                        onPress={() =>
                            router.push({
                                pathname: '/(tabs)/library/songdetails',
                                params: { trackId: track.id },
                            })
                        }
                    >
                        <Image source={{ uri: track.image }} style={styles.trackImage} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.trackTitle} numberOfLines={1}>{track.name}</Text>
                            <Text style={styles.trackArtist} numberOfLines={1}>{track.artist}</Text>
                        </View>
                        <Entypo name="dots-three-vertical" size={16} color="#ccc" />
                    </TouchableOpacity>
                ))}
            </View>
        </Body>
    );
};

export default PlaylistDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    gradient: {
        padding: 20,
        paddingTop: 60,
        alignItems: 'center',
    },
    playlistImage: {
        width: 180,
        height: 180,
        borderRadius: 8,
        marginBottom: 20,
    },
    playlistTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    songCount: {
        color: '#aaa',
        fontSize: 14,
        marginTop: 4,
    },
    songList: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    trackRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 18,
    },
    trackImage: {
        width: 52,
        height: 52,
        borderRadius: 4,
        marginRight: 12,
    },
    trackTitle: {
        color: '#fff',
        fontSize: 15,
    },
    trackArtist: {
        color: '#aaa',
        fontSize: 13,
        marginTop: 2,
    },
    loaderContainer: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
