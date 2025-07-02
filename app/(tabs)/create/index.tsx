import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { createPlaylistForUser } from '@/lib/sportifyApi'; // You’ll define this
import Button from '@/component/utilities/Button';
import Body from '@/component/layout/Body';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const CreatePlaylistScreen = () => {
    const [name, setName] = useState('');
    const router = useRouter();

    const handleCreate = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Playlist name cannot be empty');
            return;
        }

        try {
            await createPlaylistForUser(name.trim());
            router.back();
        } catch (error) {
            Alert.alert('Failed to create playlist', error);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <LinearGradient
                colors={['#1A2F45', '#121212', '#000']}
                style={{ flex: 1, paddingHorizontal: 20 }}
            >

                <View style={{
                    justifyContent: "center",
                    flex: 1
                }}>
                    <Text style={styles.title}>Give your playlist a name</Text>

                    <TextInput
                        placeholder="Enter playlist name"
                        placeholderTextColor="#888"
                        value={name}
                        onChangeText={setName}
                        style={styles.input}
                    />

                    <View style={styles.buttonRow}>
                        <Button type='outline' onPress={() => router.back()}>Cancel</Button>
                        <Button type='green' onPress={() => handleCreate()}>Create</Button>

                    </View>
                </View>

            </LinearGradient>
        </SafeAreaView>

    );
};

export default CreatePlaylistScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: 22,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 40,
        fontWeight: '600',
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#fff',
        fontSize: 24,
        color: '#fff',
        marginBottom: 40,
        marginHorizontal: 10,
        paddingVertical: 6,
        textAlign: "center"
    },
    buttonRow: {
        flexDirection: "row"
    },
    cancelButton: {
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#333',
        flex: 1,
        marginRight: 10,
    },
    createButton: {
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#1ED760',
        flex: 1,
        marginLeft: 10,
    },

});
