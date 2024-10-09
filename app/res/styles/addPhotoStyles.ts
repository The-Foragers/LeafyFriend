
import { StyleSheet } from 'react-native';
import { MD3Theme } from 'react-native-paper';

export const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
      container: {
      flex: 1,
      padding: 10,
      paddingTop: 100,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      backgroundColor: theme.colors.background,
    },
    imageContainer: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
      borderWidth: 0,
      borderColor: '#ccc',
      borderRadius: 0,
      overflow: 'hidden',
    },
    previewImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
    },
    noImageText: {
      fontSize: 16,
      color: 'gray',
    },
    textContainer: {
      width: '100%',
      paddingHorizontal: 10,
      marginBottom: 20,
    },
  
    //Plant text and information
    mainText: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.colors.onBackground,
    },
    secondaryText: {
      fontSize: 16,
      color: theme.colors.onBackground,
    },
    organContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 10,
    },
    organButton: {
      padding: 10,
      margin: 5,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: 'gray',
    },
    selectedOrganButton: {
      backgroundColor: 'lightblue',
    },
    organButtonText: {
      fontSize: 16,
    },
    plantItem: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    plantName: {
      fontSize: 16,
    },
    plantScore: {
      fontSize: 14,
      color: 'gray',
    },
  
    //button styles
    saveGardenButton: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        backgroundColor: theme.colors.secondary,
        paddingHorizontal: 0,
        flex: 1,
      },
      addPhotoButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: theme.colors.secondary,
        color: theme.colors.onSecondary, // change text color to onSecondary
        paddingHorizontal: 0,
        flex: 1,
      },
  
  // Loading message styles
    loadingContainer: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: [{ translateX: -50 }, { translateY: -50 }],
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      padding: 10,
      borderRadius: 5,
    },
    loadingText: {
      color: 'white',
      fontSize: 16,
    },
    // Modal styles
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });