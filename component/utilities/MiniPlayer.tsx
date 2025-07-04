import { useSegments } from 'expo-router';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Svg } from '@/assets';

export default function MiniPlayer() {
    const { currentTrack, isPlaying, stop, pause, resume } = useAudioPlayer();
    const segments = useSegments();
    const currentTab = segments[2];

    if (currentTab === 'create' || !currentTrack) return null;



    return (
        <LinearGradient
            colors={['#232526', '#414345']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.container}

        >
            <TouchableOpacity style={styles.leftSection} onPress={() => { }}>

                {currentTrack.image ? (
                    <Image source={{ uri: currentTrack.image }} style={styles.albumArt} />
                ) : (
                    <View style={styles.fallbackImage}>
                        <Text style={styles.fallbackText}>{currentTrack.title?.[0]?.toUpperCase() || '?'}</Text>
                    </View>
                )}


                <View style={styles.info}>
                    <Text numberOfLines={1} style={styles.title}>
                        {currentTrack?.title || 'Unknown Title'}
                    </Text>
                    <Text numberOfLines={1} style={styles.artist}>
                        {currentTrack?.artist || 'Unknown Artist'}
                    </Text>
                </View>
            </TouchableOpacity>
            <View style={styles.controls}>

                <TouchableOpacity onPress={isPlaying ? pause : resume}>
                    {isPlaying ? <Svg.Pause width={24} height={24} /> : <Svg.Play width={24} height={24} />}
                </TouchableOpacity>

                <TouchableOpacity onPress={stop} style={{ marginLeft: 12 }}>
                    <Svg.Stop width={24} height={24} color="#fff" />
                </TouchableOpacity>




            </View>


        </LinearGradient>

    );
}

const styles = StyleSheet.create({

    container: {
        position: 'absolute',
        bottom: 100,
        left: 16,
        right: 16,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 14,
        backgroundColor: '#2c2c2c',
        zIndex: 1000,
        elevation: 10,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        width: " 60%"
    },
    albumArt: {
        width: 42,
        height: 42,
        borderRadius: 4,
        backgroundColor: '#444',
        marginRight: 12,
    },
    info: {
        flex: 1,
    },
    title: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    artist: {
        color: '#aaa',
        fontSize: 12,
    },
    fallbackImage: {
        width: 42,
        height: 42,
        borderRadius: 4,
        backgroundColor: '#444',
        marginRight: 12,
        justifyContent: "center",
        alignItems: "center"
    },
    fallbackText: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold"
    },
    controls: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 10
    }
});

