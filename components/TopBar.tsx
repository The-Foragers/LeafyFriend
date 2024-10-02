import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

type TopBarProps = {
  title: string;
  showSettings?: boolean;
  onSettingsPress?: () => void;
};

export default function TopBar({ title, showSettings, onSettingsPress }: TopBarProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {showSettings && (
        <TouchableOpacity onPress={onSettingsPress} style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={28} color="#333" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 100, // Increased height of the bar
    paddingHorizontal: 30,
    paddingTop: 50, // Adjust padding to move text lower
    backgroundColor: '#e6f5e6',
    flexDirection: 'row',
    alignItems: 'flex-start', // Align items to the start to keep text lower
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 24, // Increased font size for better visibility
    fontWeight: 'bold',
    color: '#2E8B57',
  },
  settingsButton: {
    padding: 10,
  },
});
