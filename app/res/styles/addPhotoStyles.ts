
import { StyleSheet } from 'react-native';
import { MD3Theme } from 'react-native-paper';

export const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    scrollViewContent: {
      flexGrow: 1,
      justifyContent: 'space-between',
      padding: 0,
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


    welcomeContainer: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: [{ translateX: -50 }, { translateY: -50 }],
      alignItems: 'center',
    },
    
    welcomeText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.primary,
      textAlign: 'left',
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
        plantInfoContainer: {
          marginTop: 5,
          padding: 5,
          backgroundColor: theme.colors.background,
          borderRadius: 10,
          alignItems: 'center',
        },
        plantInfoText: {
          fontSize: 16,
          color: '#333',
          textAlign: 'left', // Align text to the left
          width: '100%', // Ensure the text takes the full width of the container
        },
        plantImage: {
          width: 300,
          height: 300,
          borderRadius: 10,
        },
        imageNavigationContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between', // Ensure space between arrows and image
          marginTop: 10, // Add margin to separate from other elements
        },
        arrowButton: {
          padding: 10,
        },
        arrowText: {
          fontSize: 24,
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

      resetButton: {
       backgroundColor: theme.colors.secondary,
       justifyContent: 'center', // Center contents vertically
       alignItems: 'center',

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
      speciesInfoContainer: {
        flex: 1,
        padding: 0, // Adjusted padding for better spacing
        marginBottom: 20, // Added margin to separate from other content
        borderRadius: 10, // Added to match info containers style
        width: '100%', // Ensure it takes the full width
      },
      infoContainer: {
        backgroundColor: theme.colors.surface,
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
        width: '100%', // Ensure it takes the full width
        alignSelf: 'stretch', // Stretch to fill the container
        shadowColor: '#000', // Added shadow for consistency with other elements
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
      },
      plantNameText: {
        fontSize: 24, // Make it larger for emphasis
        fontWeight: 'bold',
        color: theme.colors.primary,
        textAlign: 'center',
        marginVertical: 10,
      },
      
      modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 10,
        backgroundColor: 'transparent', // Ensure no background color clashes
      },
      
      modalText: {
        fontSize: 16, // Adjusted for readability
        lineHeight: 22,
        color: theme.colors.onSurface,
        marginVertical: 5, // Adjusted for consistent spacing
        textAlign: 'left',
      },
      
      
      
      infoTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#555',
        marginBottom: 5,
      },
      

        speciesRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 8,

        },



        /*Organ Modal  */


        organModalContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
        },
        organModalContent: {
          width: '80%',
          backgroundColor: theme.colors.surfaceVariant,
          borderRadius: 10,
          padding: 20,
          alignItems: 'center',
        },
        organModalTitle: {
          fontSize: 20,
          fontWeight: 'bold',
          marginBottom: 20,
          color: theme.colors.inverseSurface,
        },
        organModalGridContainer: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
        },
        organModalGridItem: {
          width: '25%',
          alignItems: 'center',
          marginVertical: 10,
        },
        organModalImage: {
          width: 50,
          height: 50,
          marginBottom: 5,
        },
        organModalOption: {
          fontSize: 14,
          textAlign: 'center',
        },
/* End of organModal */

  
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
      width: 85,
      height: 85,
      borderRadius: 15,
      marginHorizontal: 10, // Add horizontal margin to space out images
    },
    imageRow: {
      flexDirection: 'row',
      justifyContent: 'space-around', // Space out the images evenly
      alignItems: 'center',
      marginTop: 10,
    },

    speciesDataContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#d4edda', // Light green background color
        borderRadius: 10, // Optional: to give rounded corners
        margin: 10, // Optional: to add margin around the container
        shadowColor: '#000', // Optional: to add a shadow effect
        shadowOffset: { width: 0, height: 2 }, // Optional: shadow offset
        shadowOpacity: 0.3, // Optional: shadow opacity
        shadowRadius: 4, // Optional: shadow radius
        elevation: 5,
        //padding: 10, // Optional: for Android shadow
      },
      speciesDataTitle: {
        fontSize: 20,
        paddingTop: 10,
        paddingBottom: 5,
        fontWeight: 'bold',
      },

  });