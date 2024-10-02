import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import TopBar from '@/components/TopBar';

export default function GardenScreen() { // Rename HomeScreen to GardenScreen
  const handleSettingsPress = () => {
    // Handle the settings button press here (e.g., navigate to settings screen)
    alert('Settings button pressed');
  };

  return (
    <View style={styles.container}>
      <TopBar title="My Garden" showSettings={true} onSettingsPress={handleSettingsPress} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.heading}>My Garden</Text>
        <View style={styles.plantContainer}>
          <Text style={styles.plantName}>Monstera Deliciosa</Text>
        </View>
        <View style={styles.plantContainer}>
          <Text style={styles.plantName}>Fiddle Leaf Fig</Text>
        </View>
        {/* Add more plants as desired */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#cae8ca',
  },
  scrollContainer: {
    padding: 20,
    alignItems: 'center',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginBottom: 20,
  },
  plantContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  plantImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  plantName: {
    fontSize: 18,
    color: '#333',
  },
});
