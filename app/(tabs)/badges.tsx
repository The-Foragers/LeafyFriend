import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import TopBar from '@/components/TopBar';
import { Button, Provider as PaperProvider, useTheme, MD3Theme } from 'react-native-paper';
import { makeStyles } from '@/app/res/styles/badgesStyles'; // Import the styles

export default function BadgesScreen() {
  const theme = useTheme();
  const styles = makeStyles(theme);


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
