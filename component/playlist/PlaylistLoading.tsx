import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PlaylistLoading() {
    return (
        <View style={styles.loaderContainer}>
            <Text style={{ color: '#aaa' }}>Loading...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212',
    },
});
