import { StyleSheet, Dimensions } from 'react-native';
import { MD3Theme } from 'react-native-paper';
import { Platform } from 'react-native';

const { width, height } = Dimensions.get('window');
export const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({

    /* Styles for the Garden Screen */
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
        paddingVertical: 20,
        paddingHorizontal: 10,

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
        position: 'relative', // Enable positioning for overlays
      },

      plantImage: {
        width: 155,
        height: 155,
        borderRadius: 15,
        marginBottom: 5,
      },
    plantTitle: {
      flexDirection: 'row',
      //justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      paddingHorizontal: 10,
    },
    plantName: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
      color: theme.colors.primary,
    },
    daysUntilNextWatering: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.primary,
    },

    wateringInfo: {
      fontSize: 14,
      color: 'green', // or any color that fits your theme
      marginTop: 4,
    },
    overdueWateringInfo: {
      fontSize: 14,
      color: 'red',
      marginTop: 4,
    },

    menuContainer: {
      alignItems: 'flex-end',
      marginRight: 10,
    },
    wateringPeriod: {
      fontSize: 12,
      color: theme.colors.secondary,
      marginTop: 4,
    },

    plantType: {
        fontSize: 14,
        color: '#777', // Lighter text for the plant type
      },

      sortButton: {
        margin: 10,
        padding: 10,
        backgroundColor: theme.colors.primary,
      },
    overlayContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'space-between',
    },
    daysOverlay: {
      //backgroundColor: 'rgba(0, 0, 0, 0.5)',
      color: '#fff',
      padding: 5,
      borderRadius: 5,
    },
    settingsButton: {
      position: 'absolute',
      top: 15,
      //bottom: 5,
      right: 9,
      padding: 5,
      borderRadius: 5,
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    settingsIcon: {
      fontSize: 24,
      color: '#fff',
    },
    waterIcon: {
      margin: 0,
      //backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    waterDropContainer: {
      position: 'absolute',
      top: 10,
      left: 5,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 25,
      padding: 0,
    },
    dropBlue: {
      backgroundColor: 'blue',
    },
    dropGreen: {
      backgroundColor: '#db0028',
    },
    dropRed: {
      backgroundColor: theme.colors.error,
    },
    dropText: {
      position: 'absolute',
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    dropIcon: {
      fontSize: 40, // Increase the size
    },
/* End of Styles for the Garden Screen */

/* Menu modal to change name, photo etc*/
selectedPlantContainer: {
  alignItems: 'center',
  marginBottom: 16,
},
selectedPlantImage: {
  width: '100%',
  height: height * 0.4, // Adjust the height based on screen height
  resizeMode: 'contain',
  borderRadius: 10,
  marginBottom: 0,
},
selectedPlantName: {
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 5,
  color: theme.colors.primary,
},


menuModalContainer: {
  flex: 1,
  justifyContent: 'flex-end', // Align it to the bottom
  backgroundColor: theme.colors.secondaryContainer, // Similar background overlay
},
menuModalContent: {
  backgroundColor: theme.colors.secondaryContainer, // Use main modal's background color
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  padding: 20,
  width: '100%',
  maxHeight: '50%', // Make it smaller than the main modal
  alignItems: 'center',
},
menuItem: {
  paddingVertical: 10,
  backgroundColor: theme.colors.secondaryContainer, // Use surface color
  alignItems: 'center',
  width: '100%',
  borderBottomWidth: 1,
  borderBottomColor: theme.colors.outline, // Divider line
},
menuItemText: {
  fontSize: 16,
  color: theme.colors.onSurface,
  textAlign: 'center',
  paddingVertical: 8,
},
settmodalButtonContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 10,
},
modalButton: {
  backgroundColor: theme.colors.primaryContainer, // Customize this color
  paddingVertical: 10,
  paddingHorizontal: 15,
  borderRadius: 10,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 3,
  marginHorizontal: 10, // Add margin to separate buttons
},
modalButtonText: {
  color: theme.colors.onPrimaryContainer,
  fontSize: 16,
  fontWeight: 'bold',
  textAlign: 'center',
},

/*end of Menu modal for individual plants */

/*Modal to edit plant information */
renameModalContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.0)',
},
renameModalContent: {
  width: '80%',
  backgroundColor: theme.colors.background,
  borderRadius: 10,
  padding: 20,
  alignItems: 'center',
},
renameModalTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 20,
  color: theme.colors.inverseSurface,
},
textInput: {
  width: '100%',
  height: 40,
  borderColor: theme.colors.primary,
  borderWidth: 1,
  borderRadius: 5,
  paddingHorizontal: 10,
  marginBottom: 20,
},
buttonContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
},
button: {
  flex: 1,
  marginHorizontal: 5,
},

/* Modal to display individual plant information */
      modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
      },
      modalStyle: {
        justifyContent: 'flex-end',
        margin: 0,
      },
      modalContent: {
        backgroundColor: theme.colors.background,
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '95%',
      },

      scrollViewContent: {
        alignItems: 'center',
      },
      fullImage: {
        width: '100%',
        height: height * 0.5, // Adjust the height based on screen height
        resizeMode: 'contain',
        borderRadius: 10,
        marginBottom: 0,
      },
      modalText: {
        fontSize: 18,
        color: theme.colors.onSurface,
        marginTop: 10,
        textAlign: 'left',
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
        fontSize: 30,
        textAlign: 'center',
        fontWeight: 'bold',
      },
      deleteButton: {
        flex: 1,
        padding: 15,
        backgroundColor: '#2089ac',
        borderRadius: 5,
        marginLeft: 5,
      },
      deleteButtonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
      },

      modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 10,
        marginBottom: 0,
        backgroundColor:'transparent',
      },
      topCloseButton: {
        backgroundColor: 'transparent',
      },
      menuButton: {
        backgroundColor: 'transparent',
      },
      menuIconText: {
        fontSize: 24, // Adjust this as needed
        color: '#333',
        fontWeight: 'bold',
      },

      /* Plant Modal */
      //divider in watering
      divider: {
        height: 1,
        backgroundColor: theme.colors.onSurface,
        marginVertical: 10,
      },

      topCloseButtonText: {
        fontSize: 30,
        color: '#333', // Adjust color as needed
        fontWeight: 'bold',
      },
      
      plantNameText: {
        fontSize: 24, // Make it larger
        fontWeight: 'bold',
        color: theme.colors.primary,
        textAlign: 'center',
        marginVertical: 10,
      },
      infoContainer: {
        backgroundColor: theme.colors.surface,
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
        width: '100%',
      },
      infoTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.onSurface,
        marginBottom: 5,
      },

      modalsubText: {
        fontSize: 20, // Adjusted for readability
        color: theme.colors.onSurface,
        marginVertical: 2,
        textAlign: 'left',
      },

      // modalText: { duplicate of container
      //   fontSize: 16, // Adjusted for readability
      //   color: theme.colors.onSurface,
      //   marginVertical: 2,
      //   textAlign: 'left',
      // },
      
/* End of Modal for individual plant information*/

/**
 * Watering modal styles
 */

wateringModalContent: {
  //flexDirection: 'row',
  //flexWrap: 'wrap',
  //justifyContent: 'space-between',
  paddingTop: Platform.OS === 'ios' ? 40 : 0,
  padding: 10,
  //alignItems: 'stretch',
  paddingVertical: 40,
  paddingHorizontal: 10,
  backgroundColor: theme.colors.background,
  //borderTopLeftRadius: 20,
  //borderTopRightRadius: 20,
  maxHeight: '100%',
},
row: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between', // Space items evenly
  paddingHorizontal: 10, // Add some padding
  gap: 10, // Space between items for better readability
},
input: {
  //flex: 1, // Make the input fields take equal available space
  height: 45, // Slightly increase height for a larger touch area
  borderWidth: 1,
  width: '20%',  
  borderColor: '#ccc',
  borderRadius: 10, // Rounded edges for a softer look
  marginHorizontal: 0, // Add space between inputs
  paddingHorizontal: 0,
  textAlign: 'center', // Center text within the input
  fontSize: 18, // Increase font size for readability
},
picker: {
  flex: 1,
  height: 45, // Match picker height with input for uniformity
  backgroundColor: theme.colors.surface, // Match input background color
  color: '#333',
  borderRadius: 50, // Rounded edges for consistency with inputs
  marginHorizontal: 5,
  justifyContent: 'center', // Center the content vertically
  padding: Platform.OS === 'ios' ? 0 : 8, // Add padding on Android
},
winterFooter: {
  flexDirection: 'row',
  justifyContent: 'center', // Center the buttons
  alignItems: 'center',
  width: '100%',
  padding: 10,
  paddingBottom: 20, // Add space below footer for separation from content
  backgroundColor: theme.colors.background,
  //borderTopWidth: 1,
  //borderColor: theme.colors.outline,
  //marginTop: 10, // Add space above footer for separation from content
},
modalFooter: {
  flexDirection: 'row',
  justifyContent: 'center', // Center the buttons
  alignItems: 'center',
  width: '100%',
  padding: 10,
  paddingBottom: 20, // Add space below footer for separation from content
  backgroundColor: theme.colors.surface,
  borderTopWidth: 1,
  borderColor: theme.colors.outline,
  //marginTop: 10, // Add space above footer for separation from content
},
wateringCancelButton: {
  paddingVertical: 12, // Increase padding for easier tapping
  paddingHorizontal: 20,
  backgroundColor: theme.colors.secondary, // Subtle background for cancel button
  borderRadius: 10,
  alignItems: 'center',
  justifyContent: 'center',
  marginHorizontal: 10, // Add margin to separate buttons
},
wateringSaveButton: {
  paddingVertical: 12,
  paddingHorizontal: 20,
  backgroundColor: theme.colors.primary, // Distinct background for save button
  borderRadius: 10,
  alignItems: 'center',
  justifyContent: 'center',
  marginHorizontal: 10, // Add margin to separate buttons
},

buttonText: {
  color: theme.colors.onPrimary,
  fontSize: 16,
},

winterRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  paddingBottom: 10,
},


settingsModalContainer: {
  backgroundColor: 'white',
  padding: 20,
  borderRadius: 10,
  // ...other styles...
},
modalTitleSettings: {
  fontSize: 20,
  fontWeight: 'bold',
  // ...other styles...
},
modalSubtitle: {
  fontSize: 16,
  marginVertical: 10,
  // ...other styles...
},
paletteContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  marginVertical: 10,
},
paletteOption: {
  padding: 10,
  borderRadius: 5,
  backgroundColor: '#f0f0f0',
  margin: 5,
},
selectedPaletteOption: {
  borderColor: theme.colors.primary,
  borderWidth: 2,
},
paletteText: {
  fontSize: 16,
  color: theme.colors.onPrimary, // Ensure text is readable on different background colors
},
modalButtonRemove: {
  marginTop: 20,
  paddingVertical: 10,
  paddingHorizontal: 5,
  backgroundColor: theme.colors.error,
  borderRadius: 15,
  width: '40%', // Set a specific width
  alignSelf: 'center', // Center the button
  // ...other styles...
},
modalButtonTextRemove: {
  color: theme.colors.onError,
  textAlign: 'center',
  // ...other styles...
},

settingsModalButtonsContainer: {
  marginTop: 10,
},
settingsModalButton: {
  marginBottom: 15, // Add padding between buttons
},

errorContainer: {
  backgroundColor: theme.colors.error,
  padding: 10,
  borderRadius: 5,
  marginVertical: 10,
},
errorText: {
  color: theme.colors.onError,
  fontSize: 16,
  textAlign: 'center',
},

  });