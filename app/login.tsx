import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Svg } from '@/assets';
import Button from '@/component/utilities/Button';
import { useRouter } from 'expo-router';
import { useSpotifyAuth } from '@/hooks/useSportifyAuth'; // ✅ import custom hook
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
  const router = useRouter();
  const { promptAsync, request } = useSpotifyAuth();


  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 24 }}>
      <View style={styles.logoContainer}>
        <Svg.LogoWhite width={70} height={70} style={{ marginBottom: 10 }} />
        <Text style={styles.text}>Log in to Spotify</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button type="green" onPress={() => router.push('/emailLogin')}>
          Continue with email
        </Button>
        <Button type="outline" onPress={() => router.push('/phoneNo')}>
          Continue with phone number
        </Button>
        <Button
          icon={<Svg.Google width={15} height={15} />}
          type="outline"
          onPress={() => router.push('/login')}
        >
          Continue with Google
        </Button>
        <Button
          icon={<Svg.Facebook width={20} height={20} />}
          type="outline"
          onPress={() => router.push('/(tabs)/home')}
        >
          Continue with Facebook
        </Button>
        <Button type="outline" onPress={() => promptAsync()} disabled={!request}>
          Continue with Spotify
        </Button>
        <View style={styles.ctacontainer}>
          <Text style={styles.cta}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/signup')}>
            <Text style={styles.ctabtn}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  logoContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '800',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 60,
    gap: 10,
  },
  cta: {
    color: '#fff',
    fontSize: 16,
  },
  ctabtn: {
    color: '#1ED760',
  },
  ctacontainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
});
