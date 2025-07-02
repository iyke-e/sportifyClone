import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    ImageBackground,
} from 'react-native';
import { fetchArtistDetails, fetchArtistTopTracks, fetchArtistAlbums } from '@/lib/sportifyApi';
import { LinearGradient } from 'expo-linear-gradient';
import { Svg } from '@/assets';

const ArtistDetails = () => {
    const { artistId } = useLocalSearchParams<{ artistId: string }>();
    const router = useRouter();

    const [artist, setArtist] = useState<any>(null);
    const [topTracks, setTopTracks] = useState<any[]>([]);
    const [albums, setAlbums] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof artistId !== 'string') return;

        (async () => {
            try {
                const [artistData, topTracksData, albumsData] = await Promise.all([
                    fetchArtistDetails(artistId),
                    fetchArtistTopTracks(artistId),
                    fetchArtistAlbums(artistId),
                ]);

                setArtist(artistData);
                setTopTracks(topTracksData);
                setAlbums(albumsData);
            } catch (err) {
                console.error('Error loading artist details:', err);
            } finally {
                setLoading(false);
            }
        })();
    }, [artistId]);

    if (loading || !artist) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator color="#1ED760" size="large" />
            </View>
        );
    }

    return (
        <LinearGradient
            colors={['#0a0a0a', '#1a1a2f', '#000']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={{ flex: 1 }}
        >
            <ScrollView style={{ flex: 1 }}>
                <ImageBackground
                    source={{ uri: artist.images[0]?.url }}
                    style={styles.heroBackground}
                >
                    <Text style={styles.artistName}>{artist.name}</Text>
                </ImageBackground>
                <View style={{ paddingHorizontal: 20, paddingTop: 5 }}>
                    <Text style={styles.followers}>
                        {Number(artist.followers.total).toLocaleString()} monthly listeners
                    </Text>
                    <View style={styles.actionsRow}>
                        <View style={{ flexDirection: "row", gap: 15, alignItems: "center" }}>
                            <Image source={{ uri: artist.images[0]?.url }} style={styles.artistImg2} />

                            <TouchableOpacity style={styles.followButton}>
                                <Text style={styles.followText}>Follow</Text>
                            </TouchableOpacity>
                            <Svg.Threedot width={30} height={30} />
                        </View>

                        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                            <Svg.Shuffle width={30} height={30} />
                            <TouchableOpacity style={styles.playButton}>
                                <Svg.PlayBlack width={20} height={20} />
                            </TouchableOpacity>

                        </View>

                    </View>

                </View>


                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Popular</Text>
                    {topTracks.map((track, index) => (
                        <TouchableOpacity
                            key={track.id}
                            style={styles.trackItem}
                            onPress={() => router.push({ pathname: '/(tabs)/library/songdetails', params: { trackId: track.id } })}
                        >

                            <Text style={styles.trackIndex}>{index + 1}</Text>
                            <Image source={{ uri: track.album.images[0]?.url }} style={styles.trackImage} />

                            <View style={styles.trackInfo}>
                                <Text style={styles.trackTitle} numberOfLines={1}>{track.name}</Text>
                                <Text style={styles.trackSub}>{track.album.name}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Albums</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {albums.map(album => (
                            <TouchableOpacity
                                key={album.id}
                                style={styles.albumCard}
                                onPress={() =>
                                    router.push({
                                        pathname: '/(tabs)/library/albumdetails',
                                        params: { albumId: album.id },
                                    })
                                }
                            >
                                <Image source={{ uri: album.images[0]?.url }} style={styles.albumImage} />
                                <Text style={styles.albumTitle} numberOfLines={1}>{album.name}</Text>
                            </TouchableOpacity>

                        ))}
                    </ScrollView>
                </View>
            </ScrollView>
        </LinearGradient>
    );
};

export default ArtistDetails;

const styles = StyleSheet.create({
    heroBackground: {
        height: 380,
        justifyContent: 'flex-end',
    },

    heroContent: {
        paddingVertical: 20,
        paddingHorizontal: 10,
        borderRadius: 10,
    },

    artistName: {
        fontSize: 34,
        fontWeight: 900,
        color: '#fff',
        backgroundColor: "rgba(0,0,0,0.3)",
        paddingHorizontal: 20,
        paddingVertical: 6
    },

    actionsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 14,
    },
    artistImg2: {
        width: 40,
        height: 50,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: "#aaa"
    },
    followers: {
        color: '#ccc',
        fontSize: 14,
        marginTop: 4,
    },

    centered: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#000',
    },
    artistImage: {
        width: '100%',
        height: 240,
    },

    buttonRow: {
        flexDirection: 'row',
        margin: 16,
        alignItems: 'center',
        gap: 16,
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
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 25,
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
        marginRight: 20
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
    trackImage: {
        width: 60,
        height: 60,
    },
    albumCard: {
        width: 120,
        marginRight: 16,
    },
    albumImage: {
        width: 120,
        height: 120,
        borderRadius: 8,
    },
    albumTitle: {
        color: '#fff',
        fontSize: 13,
        marginTop: 6,
    },
});
