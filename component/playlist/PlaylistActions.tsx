import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import SvgIconButton from '@/component/utilities/SvgIcons';

export default function PlaylistActions() {
    return (
        <View style={styles.actionsRow}>
            <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
                <SvgIconButton name="CircleDownload" width={24} height={24} />
                <SvgIconButton name="AddUser" width={24} height={24} />
                <SvgIconButton name="Share" width={24} height={24} />
                <SvgIconButton name="Threedot" width={24} height={24} />
            </View>

            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                <SvgIconButton name="Shuffle" width={30} height={30} />
                <TouchableOpacity style={styles.playButton}>
                    <SvgIconButton name="PlayBlack" width={20} height={20} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    actionsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 20,
        paddingHorizontal: 20,
    },
    playButton: {
        backgroundColor: '#1ED760',
        width: 56,
        height: 56,
        borderRadius: 300,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
