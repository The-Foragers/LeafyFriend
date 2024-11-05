import { StyleSheet, Dimensions } from 'react-native';
import { MD3Theme } from 'react-native-paper';

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

      sortButton: {
        margin: 10,
        padding: 10,
        backgroundColor: theme.colors.primary,
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
  backgroundColor: theme.colors.background, // Similar background overlay
},
menuModalContent: {
  backgroundColor: theme.colors.background, // Use main modal's background color
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  padding: 20,
  width: '100%',
  maxHeight: '50%', // Make it smaller than the main modal
  alignItems: 'center',
},
menuItem: {
  paddingVertical: 10,
  alignItems: 'center',
  width: '100%',
  borderBottomWidth: 1,
  borderBottomColor: theme.colors.surfaceVariant, // Divider line
},
menuItemText: {
  fontSize: 16,
  color: theme.colors.onSurface,
  textAlign: 'center',
  paddingVertical: 8,
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
        maxHeight: '80%',
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
        fontSize: 30,
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
      modalText: {
        fontSize: 16, // Adjusted for readability
        color: theme.colors.onSurface,
        marginVertical: 2,
        textAlign: 'left',
      },
      
/* End of Modal for individual plant information*/

  });