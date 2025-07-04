import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const MusicPlayerScreen = () => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>PLAYING FROM YOUR LIBRARY</Text>
                <Text style={styles.subHeaderText}>Liked Songs</Text>
            </View>
            <Image
                source={{ uri: 'https://via.placeholder.com/300x300' }} // Replace with actual album art URL
                style={styles.albumArt}
            />
            <Text style={styles.albumTitle}>MORE THAN A FRIEND</Text>
            <Text style={styles.songTitle}>TILAR</Text>
            <Text style={styles.songDuration}>3:16 / 3:39</Text>
            <View style={styles.controls}>
                <TouchableOpacity>
                    <Text style={styles.controlButton}>⏮️</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={styles.controlButton}>⏸️</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={styles.controlButton}>⏭️</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.gateText}>Music GATE</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1DB954',
        alignItems: 'center',
        paddingTop: 50,
    },
    header: {
        alignItems: 'center',
    },
    headerText: {
        color: '#fff',
        fontSize: 12,
    },
    subHeaderText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    albumArt: {
        width: 300,
        height: 300,
        marginVertical: 20,
    },
    albumTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    songTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    songDuration: {
        color: '#fff',
        fontSize: 14,
        marginVertical: 10,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '60%',
        marginVertical: 20,
    },
    controlButton: {
        fontSize: 30,
        color: '#fff',
    },
    gateText: {
        color: '#fff',
        fontSize: 12,
        marginTop: 20,
    },
});

export default MusicPlayerScreen;