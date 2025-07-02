import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { fetchAlbumById } from '@/lib/sportifyApi';
import { LinearGradient } from 'expo-linear-gradient';
import { Svg } from '@/assets';
import Body from '@/component/layout/Body';

export default function AlbumDetails() {
    const { albumId } = useLocalSearchParams<{ albumId: string }>();
    const [album, setAlbum] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        if (typeof albumId === 'string') {
            fetchAlbumById(albumId).then(setAlbum);
        }
    }, [albumId]);

    if (!album) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator color="#1ED760" size="large" />
            </View>
        );
    }

    return (
        <Body>
            <LinearGradient
                colors={['#0a0a0a', '#1a1a2f', '#000']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={{ flex: 1 }}
            >

                <View >
                    <Image source={{ uri: album.image }} style={styles.playlistImage} />
                    <Text style={styles.playlistTitle}>{album.title}</Text>
                </View>

                <View style={{ paddingHorizontal: 20, paddingTop: 5 }}>
                    <Text style={styles.artistName}>{album.artist}</Text>


                    <View style={styles.actionsRow}>
                        <View style={{ flexDirection: "row", gap: 15, alignItems: "center" }}>
                            <Image source={{ uri: album.image }} style={styles.albumImg2} />

                            <TouchableOpacity style={styles.followButton}>
                                <Text style={styles.followText}>Save</Text>
                            </TouchableOpacity>
                            <Svg.Threedot width={30} height={30} />
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <Svg.Shuffle width={28} height={28} />
                            <TouchableOpacity style={styles.playButton}>
                                <Svg.PlayBlack width={20} height={20} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    {album.tracks.map((track: any, index: number) => (
                        <TouchableOpacity
                            key={track.id}
                            style={styles.trackItem}
                            onPress={() =>
                                router.push({
                                    pathname: '/(tabs)/library/songdetails',
                                    params: { trackId: track.id },
                                })
                            }
                        >
                            <Text style={styles.trackIndex}>{index + 1}</Text>
                            <View style={styles.trackInfo}>
                                <Text style={styles.trackTitle} numberOfLines={1}>{track.name}</Text>
                                <Text style={styles.trackSub}>{track.artist}</Text>
                            </View>
                            <Text style={styles.trackDuration}>
                                {Math.floor(track.duration_ms / 60000)}:
                                {String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </LinearGradient>
        </Body>
    );
}

const styles = StyleSheet.create({
    heroBackground: {
        height: 340,
        justifyContent: 'flex-end',
    },
    playlistImage: {
        width: "80%",
        aspectRatio: 1,
        borderRadius: 8,
        marginVertical: 20,
        marginHorizontal: "auto"
    },
    playlistTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        paddingHorizontal: 20
    },
    albumTitle: {
        fontSize: 30,
        fontWeight: '900',
        color: '#fff',
        backgroundColor: "rgba(0,0,0,0.3)",
        paddingHorizontal: 20,
        paddingVertical: 6,
    },
    artistName: {
        color: '#ccc',
        fontSize: 14,
        marginTop: 4,
    },
    releaseDate: {
        color: '#888',
        fontSize: 13,
        marginTop: 2,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#000',
    },
    actionsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 14,
    },
    albumImg2: {
        width: 40,
        height: 40,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: "#aaa"
    },
    followButton: {
        borderWidth: 2,
        borderColor: '#aaa',
        paddingHorizontal: 24,
        paddingVertical: 8,
        borderRadius: 8,
    },
    followText: {
        color: '#fff',
        fontWeight: '600',
    },
    playButton: {
        backgroundColor: '#1ED760',
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    section: {
        marginTop: 10,
        marginHorizontal: 16,
        paddingBottom: 100,
    },
    trackItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    trackIndex: {
        color: '#aaa',
        width: 24,
        textAlign: 'center',
        fontWeight: 'bold',
        marginRight: 20,
    },
    trackInfo: {
        flex: 1,
        marginHorizontal: 12,
    },
    trackTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    trackSub: {
        color: '#888',
        fontSize: 12,
    },
    trackDuration: {
        color: '#aaa',
        fontSize: 12,
    },
});
