
import { StyleSheet } from 'react-native';
import { MD3Theme } from 'react-native-paper';

export const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    scrollViewContent: {
      flexGrow: 1,
      justifyContent: 'space-between',
      padding: 16,
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
      backgroundColor: theme.colors.background,
    },
    imageContainer: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 0,
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
      marginBottom: 60,
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
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '80%',
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 20,
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    modalOption: {
      fontSize: 16,
      paddingVertical: 10,
      textAlign: 'center',
      width: '100%',
      flexWrap: 'wrap', // Ensure text wraps within the container
    },
    resultContainer: {
      alignItems: 'center', // Center the content horizontally
      marginBottom: 10, // Add some space between results
    },
    resultInfo: {
      fontSize: 16,
      paddingVertical: 0,
      textAlign: 'center',
      width: '100%',
      flexWrap: 'wrap', // Ensure text wraps within the container
    },
    resultBox: {
      backgroundColor: '#7dd87d', // green background
      padding: 10, // Padding inside the box
      marginVertical: 5, // Vertical margin between boxes
      borderWidth: 1, // Border width
      borderColor: '#ccc', // Border color
      borderRadius: 5, // Rounded corners
      shadowColor: '#000', // Shadow color
      shadowOffset: { width: 0, height: 2 }, // Shadow offset
      shadowOpacity: 0.2, // Shadow opacity
      shadowRadius: 2, // Shadow radius
      elevation: 2, // Elevation for Android shadow
    },
    resultImage: {
      width: 100, // Set the width of the image
      height: 100, // Set the height of the image
      marginBottom: 10, // Add some space below the image
    },
  });