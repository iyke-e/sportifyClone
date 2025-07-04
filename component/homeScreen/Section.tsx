import type { ListItemProps } from '@/lib/sportifyApi';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { getDeezerPreview } from '@/lib/deezerApi';
import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { handleTrackPress } from '@/lib/audioplayback/trackpress';

type SectionProps = {
    title: string;
    data: ListItemProps[];
};

const Section = ({ title, data }: SectionProps) => {
    const { play } = useAudioPlayer();

    return (
        <View style={styles.section}>
            {data.map((item) => (
                <TouchableOpacity
                    key={item.id}
                    onPress={() => {
                        if (item.type === 'track') {
                            handleTrackPress({ item, play });
                        }
                    }}
                    style={styles.card}
                >
                    {item.url ? (
                        <Image source={{ uri: item.url }} style={styles.image} />
                    ) : (
                        <View style={styles.fallbackImage}>
                            <Text style={styles.fallbackText}>No Image</Text>
                        </View>
                    )}
                    <Text style={styles.cardTitle} numberOfLines={2}>
                        {item.title}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default Section;






const styles = StyleSheet.create({
    section: {
        flexDirection: "row",
        rowGap: 14,
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 30,
        paddingHorizontal: 12
    },

    card: {
        backgroundColor: "rgba(243, 243, 243, 0.2)",
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        width: "48%",
        borderRadius: 5,

    },
    image: {
        width: 55,
        height: 55,
        borderRadius: 5,
    },
    fallbackImage: {
        width: 50,
        height: 50,
        borderRadius: 8,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6,
    },
    fallbackText: {
        color: '#999',
        fontSize: 12,
        textAlign: 'center',
    },
    cardTitle: {
        fontSize: 12,
        color: '#fff',
        maxWidth: 90,
        fontWeight: "bold"
    },
});
