import ProfileDrawer from '@/component/drawers/profileDrawer';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function DrawerLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer
                screenOptions={{ headerShown: false }}
                drawerContent={(props) => <ProfileDrawer {...props} />}


            >
                <Drawer.Screen name="(tabs)" options={{ drawerLabel: 'Home' }} />
                <Drawer.Screen name="musicplayingscreen" options={{ drawerLabel: 'Play Music' }} />
            </Drawer>
        </GestureHandlerRootView>
    );
}
