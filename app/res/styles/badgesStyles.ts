import { StyleSheet } from 'react-native';
import { MD3Theme } from 'react-native-paper';

export const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContainer: {
      padding: 20,
      alignItems: 'center',
    },
    heading: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.onBackground,
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
      color: theme.colors.primary,
    },
  });
  