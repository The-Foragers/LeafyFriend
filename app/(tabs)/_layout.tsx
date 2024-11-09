import { Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { useTheme, MD3Theme } from 'react-native-paper';


export default function TabLayout() {
  const theme = useTheme();

return (
  <Tabs
    initialRouteName="index"
    screenOptions={{
      tabBarActiveTintColor: theme.colors.primary,
      tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
      tabBarStyle: {
        backgroundColor: theme.colors.surface,
        borderTopWidth: 1,
        borderTopColor: theme.colors.outline,
        height: 70,
        elevation: 4, // Adds shadow on Android
        shadowOpacity: 0.1, // Adjusts shadow on iOS
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
      {/* 
      Define the tab names and icons here.
      icon obtained from https://ionic.io/ionicons
      */}

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
      {/* Chatbot Tab */}
      <Tabs.Screen
        name="chatbot"
        options={{
          title: 'AI Chat',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
