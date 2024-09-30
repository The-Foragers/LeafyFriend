import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      {/* Garden Tab */}
      <Tabs.Screen
        name="garden"
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
        options={{
          title: 'Add Photo',
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
