import * as AuthSession from 'expo-auth-session';

const redirectUri = AuthSession.makeRedirectUri({
  useProxy: true,
});

console.log("Paste this redirect URI into your Spotify Developer Dashboard:");
console.log(redirectUri);
