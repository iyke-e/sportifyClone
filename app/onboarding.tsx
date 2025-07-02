import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Svg } from '@/assets'
import Button from '@/component/utilities/Button'
import { LinearGradient } from 'expo-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import * as AuthSession from 'expo-auth-session';
import { useState, useEffect } from 'react'


const onboarding = () => {
    const [uri, setUri] = useState("")
    useEffect(() => {
        const redirectUri = AuthSession.makeRedirectUri({});
        console.log("Redirect URI:", redirectUri);
        setUri(redirectUri)
    }, []);

    const router = useRouter()
    return (
        <LinearGradient style={styles.container} colors={["#333", "#000"]}>

            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.logoContainer}>
                    <Svg.LogoWhite width={70} height={70} style={{ marginBottom: 10 }} />
                    <Text style={styles.text}>Millions of Songs.</Text>
                    <Text style={styles.text}>Free on Sportify</Text>

                </View>
                <View style={styles.buttonContainer}>
                    <Button type='green' onPress={() => { router.push("/signup") }}>
                        Sign up for free
                    </Button>
                    <Button type='outline' onPress={() => { router.push("/login") }}>
                        Log in
                    </Button>
                </View>

            </SafeAreaView>
        </LinearGradient>

    )
}

export default onboarding

const styles = StyleSheet.create({
    logoContainer: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    text: {
        color: "#fff",
        fontSize: 30,
        fontWeight: 800
    },

    container: {
        flex: 1,
        paddingHorizontal: 24
    },
    buttonContainer: {
        width: "100%",
        marginBottom: 60,
        gap: 10
    }
})