import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme, MD3Theme } from 'react-native-paper';


type TopBarProps = {
  title: string;
  showSettings?: boolean;
  onSettingsPress?: () => void;
};

export default function TopBar({ title, showSettings, onSettingsPress }: TopBarProps) {
  const theme = useTheme();
  const styles = makeStyles(theme);

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

const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      width: '100%',
      height: 100, // Increased height of the bar
      paddingHorizontal: 30,
      paddingTop: 51, // Adjust padding to move text lower
      backgroundColor: theme.colors.surface,
      flexDirection: 'row',
      alignItems: 'flex-start', // Align items to the start to keep text lower
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outline,
    },
    title: {
      fontSize: 24, // Increased font size for better visibility
      fontWeight: 'bold',
      color: theme.colors.onSurface,
    },
    settingsButton: {
      color: theme.colors.onSurface,
      padding: 10,
    },
  });
