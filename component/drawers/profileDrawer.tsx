import React, { useEffect, useState } from 'react';
import {
    DrawerContentScrollView,
    DrawerItem,
    DrawerContentComponentProps,
} from '@react-navigation/drawer';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
} from 'react-native';
import { getCurrentUserProfile } from '@/lib/sportifyApi';
import { useAuth } from '@/context/AuthContext';
import { FontAwesome5, MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';

const ProfileDrawer: React.FC<DrawerContentComponentProps> = (props) => {
    const { logout } = useAuth();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        async function loadUser() {
            try {
                const data = await getCurrentUserProfile();
                setUser(data);
            } catch (err) {
                console.warn('Error loading user:', err);
            }
        }
        loadUser();
    }, []);

    const initials = user?.display_name?.slice(0, 1).toUpperCase() || 'A';

    return (
        <DrawerContentScrollView
            {...props}
            contentContainerStyle={{
                flex: 1,
                backgroundColor: '#121212',
                paddingStart: 0,
                paddingEnd: 0,

            }}
        >
            <View style={styles.profile}>
                {user?.images?.[0]?.url ? (
                    <Image source={{ uri: user.images[0].url }} style={styles.avatar} />
                ) : (
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{initials}</Text>
                    </View>
                )}
                <View>
                    <Text ellipsizeMode='tail' numberOfLines={1} style={styles.name}>{user?.display_name}</Text>

                    <TouchableOpacity>
                        <Text style={styles.viewProfile}>View profile</Text>
                    </TouchableOpacity>
                </View>


            </View>

            <View style={styles.menu}>
                <DrawerItem
                    label="Add Account"
                    icon={() => <Ionicons name="person-add-outline" size={32} color="#fff" />}
                    onPress={() => { }}
                    labelStyle={styles.label}
                />
                <TouchableOpacity style={styles.premiumRow} onPress={() => { }}>
                    <View style={styles.rowLeft}>
                        <FontAwesome5 name="spotify" size={32} color="#fff" style={{ marginRight: 16 }} />
                        <Text style={styles.label}>Your Premium</Text>
                    </View>
                    <View style={styles.premiumBadge}>
                        <Text style={styles.premiumText}>Individual</Text>
                    </View>
                </TouchableOpacity>

                <DrawerItem
                    label="What's new"
                    icon={() => <Ionicons name="flash-outline" size={32} color="#fff" />}
                    onPress={() => { }}
                    labelStyle={styles.label}
                />
                <DrawerItem
                    label="Recents"
                    icon={() => <Ionicons name="time-outline" size={32} color="#fff" />}
                    onPress={() => { }}
                    labelStyle={styles.label}
                />
                <DrawerItem
                    label="Settings and privacy"
                    icon={() => <Feather name="settings" size={32} color="#fff" />}
                    onPress={() => { }}
                    labelStyle={styles.label}
                />
                <View style={{ flex: 1, justifyContent: "flex-end" }}>
                    <DrawerItem
                        label="Logout"
                        icon={() => <MaterialIcons name="logout" size={32} color="#fff" />}
                        onPress={logout}
                        labelStyle={styles.label}
                        style={{ backgroundColor: "rgba(253, 253, 253, 0.1)", borderRadius: 8, marginHorizontal: 10 }}
                    />

                </View>

            </View>
        </DrawerContentScrollView>
    );
};

export default ProfileDrawer;

const styles = StyleSheet.create({
    profile: {
        borderBottomWidth: 1,
        borderBottomColor: '#282828',
        paddingBottom: 12,
        paddingHorizontal: 14,
        paddingTop: 5,
        flexDirection: "row",
        gap: 10,
        alignItems: 'center',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 100,
        backgroundColor: '#B36F46',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    avatarText: {
        color: '#fff',
        fontSize: 40,
        fontWeight: 'bold',
    },
    name: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 20,
        maxWidth: 200
    },
    viewProfile: {
        color: '#aaa',
        fontSize: 12,
        marginTop: 2,
    },
    menu: {
        flex: 1,
        paddingTop: 10,
    },
    label: {
        color: '#fff',
        fontSize: 14,
    },
    premiumRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
    },

    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    premiumBadge: {
        backgroundColor: '#F6D9E0',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
        marginLeft: -12,
    },
    premiumText: {
        fontSize: 12,
        fontWeight: 500,
        color: '#000',
    },
});
