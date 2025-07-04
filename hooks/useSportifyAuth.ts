import { ResponseType, useAuthRequest, makeRedirectUri } from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

WebBrowser.maybeCompleteAuthSession();

const CLIENT_ID = '9e4ec4a0d49d42e4a9bc43ff9de47dda';

const SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-read-recently-played',
  'user-top-read',
  'user-library-read',
  'user-library-modify',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'streaming',
  'app-remote-control',
  'playlist-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-modify-private',
  'user-follow-read',
  'user-follow-modify',
  'user-read-playback-position',
];

const REDIRECT_URI = makeRedirectUri({
  native: 'sportifyclonexpo://sportify-auth-callback',
});

const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

export const useSpotifyAuth = () => {
  const { setLoggedIn } = useAuth();

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: SCOPES,
      responseType: ResponseType.Code,
      usePKCE: true,
      redirectUri: REDIRECT_URI,
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      exchangeCodeForToken(code);
    } else if (response?.type === 'error') {
      console.log('Spotify auth error:', response.error);
    }
  }, [response]);

  const exchangeCodeForToken = async (code: string) => {
    if (!request?.codeVerifier) {
      console.error('Missing code verifier');
      return;
    }

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      code_verifier: request.codeVerifier,
    });

    try {
      const res = await fetch(discovery.tokenEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });

      const data = await res.json();

      if (data.access_token) {
        const expiresAt = Date.now() + data.expires_in * 1000;

        await AsyncStorage.multiSet([
          ['spotify_access_token', data.access_token],
          ['spotify_expires_at', expiresAt.toString()],
          ['spotify_refresh_token', data.refresh_token ?? ''],
        ]);

        setLoggedIn(true);
      } else {
        console.error('Failed to exchange token:', data);
      }
    } catch (err) {
      console.error('Error exchanging Spotify code:', err);
    }
  };

  return {
    promptAsync,
    request,
  };
};
