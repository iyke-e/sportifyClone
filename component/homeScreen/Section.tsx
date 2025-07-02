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
import { useRouter } from 'expo-router';
import type { ListItemProps } from '@/lib/sportifyApi';

type SectionProps = {
    title: string;
    fetchData: () => Promise<ListItemProps[]>;
};

const Section = ({ title, fetchData }: SectionProps) => {
    const [list, setList] = useState<ListItemProps[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchData();
                setList(data);
            } catch (err) {
                console.error('Failed to fetch section data:', err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>

            {loading ? (
                <ActivityIndicator color="#1ED760" size="small" />
            ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {list.map((item, index) => (
                        <TouchableOpacity
                            key={item.id}
                            onPress={() => {
                                if (item.type === 'track') {
                                    router.push({
                                        pathname: '/(tabs)/home/songdetails',
                                        params: { trackId: item.id },
                                    });
                                } else if (item.type === 'playlist') {
                                    router.push({
                                        pathname: '/(tabs)/home/playlistdetails',
                                        params: { playlistId: item.id },
                                    });
                                }
                            }}
                            style={[styles.card, index === 0 && { marginLeft: 16 }]}
                        >
                            {item.url ? (
                                <Image source={{ uri: item.url }} style={styles.image} />
                            ) : (
                                <View style={styles.fallbackImage}>
                                    <Text style={styles.fallbackText}>No Image</Text>
                                </View>
                            )}
                            <Text style={styles.cardTitle} numberOfLines={1}>
                                {item.title}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
        </View>
    );
};

export default Section;

const styles = StyleSheet.create({
    section: {
        marginVertical: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
        marginLeft: 16,
    },
    card: {
        width: 160,
        marginRight: 16,
    },
    image: {
        width: 160,
        height: 160,
        borderRadius: 8,
        marginBottom: 6,
    },
    fallbackImage: {
        width: 160,
        height: 160,
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
        fontSize: 14,
        color: '#fff',
    },
});
