import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { TouchableOpacity, Image, StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { getCurrentUserProfile } from '@/lib/sportifyApi';

export default function AvatarDrawerTrigger() {
    const navigation = useNavigation<DrawerNavigationProp<any>>();
    const [avatar, setAvatar] = useState<string | null>(null);
    const [initial, setInitial] = useState<string>('E');

    useEffect(() => {
        async function loadUser() {
            try {
                const user = await getCurrentUserProfile();
                const avatarUrl = user?.images?.[0]?.url || null;
                const firstLetter = user?.display_name?.[0]?.toUpperCase() || 'E';
                setAvatar(avatarUrl);
                setInitial(firstLetter);
            } catch (err) {
                console.warn("Failed to fetch user profile:", err);
            }
        }
        loadUser();
    }, []);

    return (
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
            {avatar ? (
                <Image source={{ uri: avatar }} style={styles.avatar} />
            ) : (
                <View style={styles.avatarFallback}>
                    <Text style={styles.avatarText}>{initial}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#ccc',
    },
    avatarFallback: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#B36F46',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
});
