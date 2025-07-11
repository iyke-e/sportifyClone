import { useEffect, useState } from 'react';
import {
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Svg } from '@/assets';
import Body from '@/component/layout/Body';
import {
    fetchFollowedArtists,
    fetchUserAlbums,
    fetchUserPlaylists,
    deleteUserPlaylist,
} from '@/lib/sportifyApi';
import { useRouter } from 'expo-router';
import AvatarDrawerTrigger from '@/component/utilities/avatarDrawer';

const Library = () => {
    const [libraryItems, setLibraryItems] = useState<any[]>([]);
    const [filteredItems, setFilteredItems] = useState<any[]>([]);
    const [activeFilter, setActiveFilter] = useState<string>('all');
    const [selectedPlaylist, setSelectedPlaylist] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);

    const router = useRouter();

    useEffect(() => {
        (async () => {
            try {
                const [playlists, albums, artists] = await Promise.all([
                    fetchUserPlaylists(),
                    fetchUserAlbums(),
                    fetchFollowedArtists(),
                ]);

                const combined = [...playlists, ...albums, ...artists];
                setLibraryItems(combined);
                setFilteredItems(combined);
            } catch (err) {
                console.error('Failed to load library:', err);
            }
        })();
    }, []);

    const handleFilter = (type: string) => {
        setActiveFilter(type);
        if (type === 'all') {
            setFilteredItems(libraryItems);
        } else {
            setFilteredItems(libraryItems.filter(item => item.type === type));
        }
    };

    const handleNavigation = (item: any) => {
        switch (item.type) {
            case 'playlist':
                router.push({
                    pathname: '/drawer/(tabs)/library/playlistdetails',
                    params: { playlistId: item.id },
                });
                break;
            case 'album':
                router.push({
                    pathname: '/drawer/(tabs)/library/albumdetails',
                    params: { albumId: item.id },
                });
                break;
            case 'artist':
                router.push({
                    pathname: '/drawer/(tabs)/library/artistdetails',
                    params: { artistId: item.id },
                });
                break;
            default:
                break;
        }
    };

    return (
        <Body style={{ padding: 16 }}>
            <View style={styles.header}>
                <AvatarDrawerTrigger />
                <Text style={styles.headerText}>Your Library</Text>
                <View style={styles.headerIcons}>
                    <View>
                        <Svg.Search width={20} height={20} />
                    </View>
                    <View>
                        <Svg.Plus width={20} height={20} />
                    </View>
                </View>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
                {['all', 'playlist', 'album', 'artist'].map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.filterChip,
                            activeFilter === item && { backgroundColor: '#3e3e3e' },
                        ]}
                        onPress={() => handleFilter(item)}
                    >
                        <Text style={styles.filterText}>
                            {item.charAt(0).toUpperCase() + item.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <View style={styles.sortRow}>
                <TouchableOpacity style={styles.sortOption}>
                    <Svg.Swap height={15} width={15} />
                    <Text style={styles.sortText}>Recents</Text>
                </TouchableOpacity>
            </View>

            <ScrollView>
                {filteredItems.map((item) => (
                    <View key={item.id} style={styles.listItem}>
                        <TouchableOpacity
                            onPress={() => handleNavigation(item)}
                            style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}
                        >
                            <Image source={{ uri: item.url }} style={styles.itemImage} />
                            <View style={styles.itemText}>
                                <Text ellipsizeMode="tail" numberOfLines={2} style={styles.itemTitle}>
                                    {item.title}
                                </Text>
                                <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                            </View>
                        </TouchableOpacity>

                        {item.type === 'playlist' && (
                            <TouchableOpacity hitSlop={40} onPress={() => {
                                setSelectedPlaylist(item);
                                setShowModal(true);
                            }}>
                                <Svg.Delete width={18} height={18} />
                            </TouchableOpacity>
                        )}
                    </View>
                ))}
            </ScrollView>

            <Modal
                visible={showModal}
                transparent
                animationType="fade"
                onRequestClose={() => {
                    setShowModal(false);
                    setSelectedPlaylist(null);
                }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>
                            Delete playlist "{selectedPlaylist?.title}"?
                        </Text>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                onPress={async () => {
                                    if (!selectedPlaylist) return;
                                    await deleteUserPlaylist(selectedPlaylist.id);
                                    setLibraryItems(prev =>
                                        prev.filter(p => p.id !== selectedPlaylist.id)
                                    );
                                    setFilteredItems(prev =>
                                        prev.filter(p => p.id !== selectedPlaylist.id)
                                    );
                                    setShowModal(false);
                                    setSelectedPlaylist(null);
                                }}
                                style={styles.deleteBtn}
                            >
                                <Text style={{ color: '#fff' }}>Yes, Delete</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    setShowModal(false);
                                    setSelectedPlaylist(null);
                                }}
                                style={styles.cancelBtn}
                            >
                                <Text style={{ color: '#fff' }}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </Body>
    );
};

export default Library;

const styles = StyleSheet.create({
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    profileCircle: {
        backgroundColor: '#333',
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileText: { color: 'white', fontWeight: 'bold' },
    headerText: { color: 'white', fontSize: 20, fontWeight: 'bold', marginLeft: 12, flex: 1 },
    headerIcons: { flexDirection: 'row', gap: 16 },
    filterRow: { marginBottom: 10 },
    filterChip: {
        backgroundColor: '#1a1a1a',
        paddingHorizontal: 16,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        marginRight: 10,
    },
    filterText: { color: 'white', fontSize: 13 },
    sortRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 14,
        alignItems: 'center',
    },
    sortOption: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    sortText: { color: 'white', fontSize: 16, fontWeight: '600' },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 30,
        marginBottom: 18,
        justifyContent: 'space-between',
    },
    itemImage: { width: 52, height: 52, borderRadius: 4, marginRight: 12 },
    itemText: { flex: 1 },
    itemTitle: { color: 'white', fontSize: 15 },
    itemSubtitle: { color: '#aaa', fontSize: 13, marginTop: 2 },

    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#222',
        padding: 20,
        borderRadius: 10,
        width: 300,
        alignItems: 'center',
    },
    modalText: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
    },
    deleteBtn: {
        backgroundColor: '#d33',
        padding: 10,
        borderRadius: 6,
        flex: 1,
        alignItems: 'center',
    },
    cancelBtn: {
        backgroundColor: '#555',
        padding: 10,
        borderRadius: 6,
        flex: 1,
        alignItems: 'center',
    },
});
