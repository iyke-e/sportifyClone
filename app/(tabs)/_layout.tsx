import { Svg } from '@/assets';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: { backgroundColor: '#0000004D', paddingTop: 10, borderColor: "transparent" },
                tabBarActiveTintColor: '#fff',
                tabBarInactiveTintColor: '#fff',
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    tabBarLabel: "Home",
                    tabBarIcon: ({ focused }) =>
                        focused
                            ? <Svg.HomeFilled width={24} height={24} />
                            : <Svg.Home width={24} height={24} />
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    tabBarLabel: "Search",

                    tabBarIcon: ({ focused }) =>
                        focused
                            ? <Svg.SearchFilled width={24} height={24} />
                            : <Svg.Search width={24} height={24} />
                }}
            />
            <Tabs.Screen
                name="library"
                options={{
                    tabBarLabel: "Library",

                    tabBarIcon: ({ focused }) =>
                        focused
                            ? <Svg.LibraryFilled width={24} height={24} />
                            : <Svg.Library width={24} height={24} />
                }}
            />
            <Tabs.Screen
                name="create"
                options={{
                    tabBarLabel: "Create",

                    tabBarIcon: ({ focused }) =>
                        <Svg.Plus
                            width={24}
                            height={24}
                        />
                }}
            />
        </Tabs>
    );
}
