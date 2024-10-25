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


      // ... other existing styles
      modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
      },
      // New styles for the modal
      modalStyle: {
        justifyContent: 'flex-end',
        margin: 0,
      },
      modalContent: {
        backgroundColor: theme.colors.surface,
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
      },
      scrollViewContent: {
        alignItems: 'center',
      },
      fullImage: {
        width: '100%',
        height: 300,
        resizeMode: 'contain',
        borderRadius: 10,
        marginBottom: 20,
      },
      modalText: {
        fontSize: 18,
        color: theme.colors.onSurface,
        marginTop: 10,
        textAlign: 'center',
      },
      modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
      },
      closeButton: {
        flex: 1,
        padding: 15,
        backgroundColor: '#6eba70',
        borderRadius: 5,
        marginRight: 5,
      },
      closeButtonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
      },
      deleteButton: {
        flex: 1,
        padding: 15,
        backgroundColor: '#ff4d4d',
        borderRadius: 5,
        marginLeft: 5,
      },
      deleteButtonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
      },


    sortButton: {
      margin: 10,
      padding: 10,
      backgroundColor: theme.colors.primary,
    },
  });