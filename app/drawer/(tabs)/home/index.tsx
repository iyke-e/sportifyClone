import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NavBtn from '@/component/homeScreen/NavBtn';
import Section from '@/component/homeScreen/Section';
import { fetchRecentlyPlayed, fetchUserPlaylists, ListItemProps } from '@/lib/sportifyApi';
import { useAuth } from '@/context/AuthContext';
import PlaylistSection from '@/component/homeScreen/PlaylistSection';
import AvatarDrawerTrigger from '@/component/utilities/avatarDrawer';

const Home = () => {
    const { logout } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [recentlyPlayed, setRecentlyPlayed] = useState<ListItemProps[]>([]);
    const [userPlaylists, setUserPlaylists] = useState<ListItemProps[]>([]);



    useEffect(() => {
        const loadData = async () => {
            try {
                const [recent, playlists] = await Promise.all([
                    fetchRecentlyPlayed(),
                    fetchUserPlaylists(),
                ]);

                setRecentlyPlayed(recent);
                setUserPlaylists(playlists);
            } catch (err) {
                console.error('Error loading home screen data:', err);
                await logout(); // auto logout on error (e.g. expired token)
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    if (isLoading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#1DB954" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.header}>
                    <AvatarDrawerTrigger />
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

                {/* Preloaded Sections */}
                <Section title="Recently Played" data={recentlyPlayed} />

                {/* Dynamic Playlist Sections */}
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
        paddingHorizontal: 16,
        paddingTop: 16
    },
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});
