import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import TopBar from '@/components/TopBar';

export default function BadgesScreen() {
  return (
    <View style={styles.container}>
      <TopBar title="Badges" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.heading}>Your Badges</Text>
        <View style={styles.badgeContainer}>

          <Text style={styles.badgeText}>First Plant Grown!</Text>
        </View>
        <View style={styles.badgeContainer}>

          <Text style={styles.badgeText}>Watering Pro!</Text>
        </View>
        {/* Add more badges as desired */}
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#228B22',
    marginBottom: 20,
  },
  badgeContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  badge: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  badgeText: {
    fontSize: 16,
    color: '#333',
  },
});
