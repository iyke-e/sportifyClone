import { ScrollView, StyleSheet, Text, View, ViewStyle } from 'react-native'
import React, { ReactNode } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const Body = ({ children, style }: { children: ReactNode, style?: ViewStyle }) => {
    return (
        <ScrollView style={[styles.container, style]}>
            <SafeAreaView style={{ flex: 1 }}>
                {children}
            </SafeAreaView>
        </ScrollView>
    )
}

export default Body

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',

    },
})