import { StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native'
import React, { ReactNode } from 'react'

type NavBtnProps = React.ComponentProps<typeof TouchableOpacity> & {
    children: ReactNode;
    onPress?: () => void;
    textStyle?: TextStyle;
    style?: ViewStyle;

}

const NavBtn = ({ children, onPress, style, textStyle, ...props }: NavBtnProps) => {
    return (
        <TouchableOpacity style={[styles.container, style]} {...props} onPress={onPress}>
            <Text style={textStyle}>{children}</Text>
        </TouchableOpacity>
    )
}

export default NavBtn

const styles = StyleSheet.create({
    container: {
        borderRadius: 300,
        height: 30,
        minWidth: 30,
        paddingHorizontal: 10,
        alignItems: "center",
        justifyContent: "center"
    }
})