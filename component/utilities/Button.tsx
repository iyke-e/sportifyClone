import { StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import React from 'react';

type ButtonProps = React.ComponentProps<typeof TouchableOpacity> & {
    children: React.ReactNode;
    onPress?: () => void;
    type?: "normal" | "green" | "outline";
    style?: ViewStyle;
    textStyle?: TextStyle;
    icon?: React.ReactNode;  // <-- add icon prop
};

const Button = ({ children, onPress, type = "normal", style, textStyle, icon, ...props }: ButtonProps) => {

    const getButtonStyle = (): ViewStyle => {
        switch (type) {
            case "green":
                return styles.green;
            case "outline":
                return styles.outline;
            default:
                return styles.normal;
        }
    };

    const getTextColorStyle = (): TextStyle => {
        switch (type) {
            case "green":
                return styles.textBlack;
            case "outline":
                return styles.textWhite;
            default:
                return styles.textWhite;
        }
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.base, getButtonStyle(), style]}
            {...props}
        >
            {icon && (
                <View style={styles.icon}>{icon}</View>
            )}
            <Text
                style={[styles.textBase, getTextColorStyle(), textStyle]}
            >
                {children}
            </Text>
        </TouchableOpacity>
    );
};

export default Button;

const styles = StyleSheet.create({
    icon: {
        position: "absolute",
        left: 15,
    },
    base: {
        flexDirection: 'row',
        paddingVertical: 14,
        paddingHorizontal: 24,
        width: "100%",
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        gap: 8
    },
    normal: {
        backgroundColor: "#333",
    },
    outline: {
        backgroundColor: "transparent",
        borderColor: "#8C8C8C",
        borderWidth: 1,
    },
    green: {
        backgroundColor: "#1ED760",
    },
    textBase: {
        fontSize: 16,
        fontWeight: "600",
    },
    textWhite: {
        color: "#fff",
    },
    textBlack: {
        color: "#000",
    },
});
