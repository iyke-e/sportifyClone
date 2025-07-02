import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { fetchTrackById } from '@/lib/sportifyApi';
import { Svg } from '@/assets';
import { LinearGradient } from 'expo-linear-gradient';
import Body from '@/component/layout/Body';

const SongDetail = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { trackId } = route.params as { trackId: string };

    const [track, setTrack] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTrack = async () => {
            const data = await fetchTrackById(trackId);
            if (data) setTrack(data);
            setLoading(false);
        };

        loadTrack();
    }, [trackId]);

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#1ED760" />
            </View>
        );
    }

    if (!track) {
        return (
            <View style={styles.loader}>
                <Text style={{ color: 'white' }}>Track not found.</Text>
            </View>
        );
    }

    return (
        <Body >
            <LinearGradient
                colors={['#e0e0e0', '#4a4a4a', '#000000', '#000000']}
                style={{ paddingHorizontal: 16 }}
            >
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Svg.BackArrow width={30} height={30} />
                </TouchableOpacity>

                <Image source={{ uri: track.album.images[0].url }} style={styles.albumArt} />

                <Text style={styles.songTitle}>{track.name}</Text>

                <View style={styles.artist}>
                    <Image source={{ uri: track.album.images[0].url }} style={styles.artistImg} />
                    <TouchableOpacity>
                        <Text style={styles.artistName}>{track.artists[0]?.name}</Text>
                    </TouchableOpacity>
                </View>


                <Text style={styles.albumInfo}>
                    {track.album.album_type.charAt(0).toUpperCase() + track.album.album_type.slice(1)} ·{' '}
                    {track.album.release_date.split('-')[0]}
                </Text>

                <View style={styles.actionsRow}>
                    <View style={{ flexDirection: "row", gap: 20, alignItems: "center" }}>
                        <Image source={{ uri: track.album.images[0].url }} style={styles.artistImg2} />

                        <Svg.CircleDownload width={23} height={30} />
                        <Svg.Threedot width={20} height={20} />
                    </View>

                    <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                        <Svg.Shuffle width={30} height={30} />
                        <TouchableOpacity style={styles.playButton}>
                            <Svg.PlayBlack width={20} height={20} />
                        </TouchableOpacity>

                    </View>

                </View>

                {/* Song Metadata */}
                <View style={styles.meta}>
                    <Text style={styles.metaText}>
                        {track.name} • {track.artists[0]?.name}
                    </Text>
                    <Text style={styles.metaSub}>
                        {track.album.release_date} • 1 song • {(track.duration_ms / 60000).toFixed(2)} min
                    </Text>
                </View>

                {/* Artist Info */}
                <View style={styles.artistSection}>
                    <Image
                        source={{ uri: track.album.images[0].url }}
                        style={styles.artistImage}
                    />
                    <Text style={styles.artistLabel}>{track.artists[0]?.name}</Text>
                </View>

            </LinearGradient>
            {/* Back Button */}

        </Body>
    );
};

export default SongDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212',
    },
    backButton: {
        padding: 16,
        position: "absolute",
        top: 0,
        left: 0
    },
    albumArt: {
        width: "55%",
        aspectRatio: 1,
        alignSelf: 'center',
        borderRadius: 8,
        marginTop: 26
    },
    artist: { flexDirection: "row", gap: 10, alignItems: "center", marginTop: 5 },
    artistImg: {
        width: 25,
        aspectRatio: 1,
        borderRadius: 100,
    },
    artistImg2: {
        width: 40,
        height: 50,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#fff"
    },
    songTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
    },
    artistName: {
        color: '#fff',
        fontWeight: 600,
        fontSize: 16,
        marginTop: 6,
    },
    albumInfo: {
        color: '#fff',
        fontSize: 14,
        marginTop: 6,
    },
    actionsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 20,
    },
    downloadButton: {
        backgroundColor: '#1ED760',
        width: 50,
        height: 50,
        borderRadius: 300,
        justifyContent: "center",
        alignItems: "center",
    },
    playButton: {
        backgroundColor: '#1ED760',
        width: 40,
        height: 40,
        borderRadius: 300,
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center"
    },
    meta: {
        alignItems: 'center',
        marginVertical: 8,
    },
    metaText: {
        color: '#fff',
        fontSize: 16,
    },
    metaSub: {
        color: '#aaa',
        fontSize: 13,
        marginTop: 4,
    },
    artistSection: {
        marginTop: 24,
        alignItems: 'center',
        marginBottom: 30,
    },
    artistImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginBottom: 8,
    },
    artistLabel: {
        color: '#fff',
        fontSize: 16,
    },
});
