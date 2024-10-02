import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
const colorScheme = useColorScheme();

  return (
    <Tabs
      initialRouteName="index"  
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: '#234425', // Darker green for inactive icons
        tabBarStyle: {
          backgroundColor: '#e6f5e6', // Setting background color to beige
          borderTopWidth: 1,
          borderTopColor: '#ccc',
          height: 70, // Slightly taller navigation bar for a more prominent look
          paddingBottom: 20,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
        headerShown: false,
      }}
    >

      {/* Garden Tab */}
      <Tabs.Screen
        name="index"  
        options={{
          title: 'Garden',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'leaf' : 'leaf-outline'} color={color} />
          ),
        }}
      />

      {/* Add New Photo Tab */}
      <Tabs.Screen
        name="addPhoto"

        /* This is the line of code that makes the option menu open each time the screen is opened */
        initialParams={{ autoOpen: true }} // Pass parameter to trigger auto-opening

        options={{
          title: 'Scan',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'camera' : 'camera-outline'} color={color} />
          ),
        }}
      />
      {/* Badges Tab */}
      <Tabs.Screen
        name="badges"
        options={{
          title: 'Badges',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'medal' : 'medal-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
