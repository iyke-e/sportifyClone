import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import Button from '@/component/utilities/Button'
import { Svg } from '@/assets'
import { Mail } from "lucide-react"

const signup = () => {
    const router = useRouter()
    return (
        <SafeAreaView style={{ flex: 1, paddingHorizontal: 24 }}>
            <View style={styles.logoContainer}>
                <Svg.LogoWhite width={70} height={70} style={{ marginBottom: 10 }} />
                <Text style={styles.text}>Log in to Spotify</Text>

            </View>
            <View style={styles.buttonContainer}>
                <Button type='green' onPress={() => { router.push("/emailLogin") }}>

                    Continue with email
                </Button>
                <Button type='outline' onPress={() => { router.push("/phoneNo") }}>
                    Continue with phone number
                </Button>
                <Button icon={<Svg.Google width={15} height={15} />} type='outline' style={{ position: "relative" }} onPress={() => { router.push("/login") }}>
                    Continue with Google
                </Button>
                <Button icon={<Svg.Facebook width={20} height={20}/>} type='outline' onPress={() => { router.push("/login") }}>
                    Continue with Facebook
                </Button>
                <View>
                    <Text>Don't have an account?</Text>
                    <TouchableOpacity onPress={() => { router.push("/signup") }}>
                        <Text>Sign up</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </SafeAreaView>
    )
}

export default signup

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