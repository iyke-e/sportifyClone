import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { AuthProvider, useAuth } from "@/context/AuthContext";

export default function RootLayoutWrapper() {
  return (
    <AuthProvider>
      <RootLayout />
    </AuthProvider>
  );
}

function RootLayout() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) return <AuthLoadingScreen />;

  return (
    <Stack
      key={isLoggedIn ? "auth" : "guest"}
      screenOptions={{
        headerShown: false,
        animation: "fade",
        contentStyle: { backgroundColor: "#000" },
      }}
    >
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>

      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
      </Stack.Protected>
    </Stack>
  );
}

function AuthLoadingScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000",
      }}
    >
      <ActivityIndicator size="large" color="#1DB954" />
    </View>
  );
}
