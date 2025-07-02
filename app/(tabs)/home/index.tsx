import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import NavBtn from '@/component/homeScreen/NavBtn';
import Section from '@/component/homeScreen/Section';
import { fetchRecentlyPlayed, fetchUserPlaylists } from '@/lib/sportifyApi';
import { useAuth } from '@/context/AuthContext';
import PlaylistSection from '@/component/homeScreen/PlaylistSection';

const Home = () => {
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };


    return (
        <ScrollView style={styles.container}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.header}>
                    <NavBtn
                        onPress={handleLogout}
                        style={{ backgroundColor: '#563131' }}
                        textStyle={{ color: '#fff' }}
                    >
                        E
                    </NavBtn>
                    <NavBtn style={{ backgroundColor: '#17B54E', width: 40 }} textStyle={{ color: '#000' }}>
                        All
                    </NavBtn>
                    <NavBtn style={{ borderColor: '#fff', borderWidth: 1.5 }} textStyle={{ color: '#fff' }}>
                        Music
                    </NavBtn>
                    <NavBtn style={{ backgroundColor: '#2a2a2a' }} textStyle={{ color: '#fff' }}>
                        Podcasts
                    </NavBtn>
                </View>

                <Section title="Recently Played" fetchData={fetchRecentlyPlayed} />
                <Section title="Your Playlists" fetchData={fetchUserPlaylists} />

                <PlaylistSection title="Made for You" searchTerm="for you" />
                <PlaylistSection title="Your Top Mixes" searchTerm="mixes" />
                <PlaylistSection title="Trending Now" searchTerm="trending" />
                <PlaylistSection title="Afrobeats Picks" searchTerm="afro" />
                <PlaylistSection title="Relaxing Vibes" searchTerm="chill" />
                <PlaylistSection title="Workout Energy" searchTerm="workout" />

            </SafeAreaView>
        </ScrollView>
    );
};

export default Home;

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        gap: 10,
    },
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 20,
    },
});
