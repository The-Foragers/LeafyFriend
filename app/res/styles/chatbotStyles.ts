import { StyleSheet } from 'react-native';
import { MD3Theme } from 'react-native-paper';

const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-end', // Put button on bottom
      backgroundColor: theme.colors.background,
    },
    messageList: {
      flex: 1,
      padding: 10,
    },
    userMessage: {
      alignSelf: 'flex-end',
      backgroundColor: theme.colors.primaryContainer,
      borderRadius: 10,
      padding: 10,
      marginVertical: 5,
      maxWidth: '80%',
    },
    botMessage: {
      alignSelf: 'flex-start',
      backgroundColor: theme.colors.secondaryContainer,
      borderRadius: 10,
      padding: 10,
      marginVertical: 5,
      maxWidth: '80%',
    },
    messageText: {
      fontSize: 16,
      color: theme.colors.onSurface,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderTopWidth: 1,
      borderTopColor: theme.colors.outline,
      backgroundColor: theme.colors.surface,
    },
    input: {
      flex: 1,
      height: 40,
      borderColor: theme.colors.primary,
      borderWidth: 1,
      borderRadius: 20,
      paddingHorizontal: 10,
      color: theme.colors.onSurface,
    },
    sendButton: {
      marginLeft: 10,
      backgroundColor: theme.colors.primary,
      borderRadius: 20,
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    sendButtonText: {
      color: theme.colors.onPrimary,
      fontSize: 16,
    },
    typingIndicatorContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      height: 40,
    },
    typingIndicatorDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: theme.colors.primary,
      marginHorizontal: 5,
    },
  });

export default makeStyles;