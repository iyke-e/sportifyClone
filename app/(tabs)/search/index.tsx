import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
    Image,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NavBtn from '@/component/homeScreen/NavBtn';
import { useAuth } from '@/context/AuthContext';
import { Svg } from '@/assets';
import { fetchSpotifyCategories, Category } from '@/lib/sportifyApi';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const Search = () => {
    const { logout } = useAuth();
    const [categories, setCategories] = useState<Category[]>([]);
    const router = useRouter()

    useEffect(() => {
        fetchSpotifyCategories().then(setCategories);
    }, []);

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.header}>
                    <View style={styles.userSection}>
                        <NavBtn
                            onPress={() => logout()}
                            style={{ backgroundColor: '#121212' }}
                            textStyle={{ color: '#fff' }}
                        >
                            E
                        </NavBtn>
                        <Text style={styles.searchTitle}>Search</Text>
                    </View>
                    <Svg.Camera width={30} height={30} />
                </View>

                <TouchableOpacity onPress={() => { router.push("/(tabs)/search/searchPage") }} style={styles.searchBarContainer}>
                    <Svg.Search width={20} height={20} style={{ marginRight: 10 }} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="What do you want to listen to?"
                        placeholderTextColor="#888"
                        editable={false}
                        pointerEvents="none"
                    />
                </TouchableOpacity>

                <Text style={styles.browseTitle}>Browse all</Text>

                <View style={styles.grid}>
                    {categories.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.card}
                            onPress={() =>
                                router.push({
                                    pathname: '/(tabs)/search/categories/[id]',
                                    params: { id: item.name.toLowerCase() },
                                })
                            }
                        >


                            <Image source={{ uri: item.iconUrl }} style={styles.image} />
                            <Text style={styles.cardTitle}>{item.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </SafeAreaView>
        </ScrollView >
    );
};

export default Search;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        paddingHorizontal: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    userSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    searchTitle: {
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold',
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1e1e1e',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 24,
    },
    searchInput: {
        color: '#fff',
        fontSize: 16,
        flex: 1,
    },
    browseTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: CARD_WIDTH,
        backgroundColor: '#1e1e1e',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
    },
    image: {
        width: '100%',
        height: CARD_WIDTH,
    },
    cardTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        padding: 8,
    },
});
