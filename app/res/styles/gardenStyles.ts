import { StyleSheet } from 'react-native';
import { MD3Theme } from 'react-native-paper';

export const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,

    },
    scrollContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingTop: 20,
        padding: 10,
        alignItems: 'stretch',

    },
    heading: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.colors.secondary,
      marginTop: 20,
      marginBottom: 20,
    },
    plantContainer: {
        backgroundColor: theme.colors.surface,
        borderRadius: 15,
        padding: 10,
        width: '95%', // Adjust width for grid
        alignItems: 'center',
        marginBottom: 10,
        elevation: 4,
      },

      plantImage: {
        width: 155,
        height: 155,
        borderRadius: 15,
        marginBottom: 5,
      },
    plantName: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
      color: theme.colors.primary,
    },
    plantType: {
        fontSize: 14,
        color: '#777', // Lighter text for the plant type
      },

    modalView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    fullImage: {
      width: '80%',
      height: '50%',
      resizeMode: 'contain',
    },
    modalText: {
      fontSize: 18,
      color: 'white',
      marginTop: 20,
    },
    modalButtonContainer: {
      flexDirection: 'row',
      marginTop: 20,
    },
    closeButton: {
      padding: 10,
      backgroundColor: '#6eba70',
      borderRadius: 5,
      marginRight: 10,
    },
    closeButtonText: {
      color: 'white',
      fontSize: 16,
    },
    deleteButton: {
      padding: 10,
      backgroundColor: '#ff4d4d',
      borderRadius: 5,
    },
    deleteButtonText: {
      color: 'white',
      fontSize: 16,
    },
  });