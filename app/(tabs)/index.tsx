import React, { useCallback, useState, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { updateUserSchedule, updateLastWatered, getImages, deleteImage, updatePlantName as updatePlantNameInDB, updatePlantImage, dropTables } from '@/app/utils/database';
import TopBar from '@/components/TopBar';
import { Button, Menu, Provider as PaperProvider, useTheme, IconButton } from 'react-native-paper';
import { makeStyles } from '@/app/res/styles/gardenStyles'; // Import the styles
import Modal from 'react-native-modal';
import * as ImagePicker from 'expo-image-picker';
import { 
  View, Text, TextInput, StyleSheet, Image, ScrollView, ActionSheetIOS, Platform,
  TouchableOpacity, Alert, NativeSyntheticEvent, NativeScrollEvent, Dimensions, Switch 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';
import { format, parseISO } from 'date-fns';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ColorPalettes } from '@/constants/themes'; // Import color palettes
import { usePalette } from '@/app/_layout'; // Import the usePalette hook
import { getPaletteColor } from '@/constants/themes'; // Import the getPaletteColor function



export default function GardenScreen() {
  // themes and styles and UI
  const { selectedPalette, setSelectedPalette } = usePalette(); // Get the selected palette and setter
  const theme = useTheme();
  const styles = makeStyles(theme);
  const {width, height } = Dimensions.get('window');
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [scrollOffset, setScrollOffset] = useState(0);

  const [images, setImages] = useState<{
    id: number;
    name: string;
    uri: string;
    species: string;
    nextWateringDate?: string | null;
    daysUntilNextWatering?: number | null;
  }[]>([]);

  /*To allow user to change plant images after saving to garden */
  const [selectedImage, setSelectedImage] = useState<{ id: number; name: string; uri: string; species: string } | null>(null);
  const [newPlantName, setNewPlantName] = useState('');
  const [newImageUri, setNewImageUri] = useState('');

  // waterring plant functions
  const [plantWateringSchedule, setPlantWateringSchedule] = useState<{ spring_summer?: string; fall_winter?: string } | null>(null);
  const [lastWatered, setLastWatered] = useState<string | null>(null);
  const [nextWateringDate, setNextWateringDate] = useState<string | null>(null);
  // Seasonal watering inputs
  const [seasonalWatering, setSeasonalWatering] = useState(false);
  const [springSummerFrom, setSpringSummerFrom] = useState('');
  const [springSummerTo, setSpringSummerTo] = useState('');
  const [springSummerUnit, setSpringSummerUnit] = useState('day');

  const [fallWinterFrom, setFallWinterFrom] = useState('');
  const [fallWinterTo, setFallWinterTo] = useState('');
  const [fallWinterUnit, setFallWinterUnit] = useState('day');

    // Add these state variables
  const [recommendedWateringSchedule, setRecommendedWateringSchedule] = useState<{ spring_summer?: string; fall_winter?: string } | null>(null);
  const [userWateringSchedule, setUserWateringSchedule] = useState<{ spring_summer?: string; fall_winter?: string } | null>(null);
  /*
  x = int, user input first day of range
  y = int, user input last day of range
  z = string, user input unit of time (day, week, month) default is day
  Winter is optional
  */
  const [customSummerFrom, setCustomSummerFrom] = useState(''); // x for summer
  const [customSummerTo, setCustomSummerTo] = useState(''); // y for summer
  const [summerUnit, setSummerUnit] = useState('day'); // z for summer

  const [customWinterFrom, setCustomWinterFrom] = useState(''); // x for winter
  const [customWinterTo, setCustomWinterTo] = useState(''); // y for winter
  const [winterUnit, setWinterUnit] = useState('day'); // z for winter
  const [winterEnabled, setWinterEnabled] = useState(false); // toggle for winter

  const [error, setError] = useState<string | null>(null);

  //const formattedDate = format(parseISO(dateString), 'MMMM do, yyyy');

  // Modals:
  const [modalVisible, setModalVisible] = useState(false);
  const [sortMenuVisible, setSortMenuVisible,] = useState(false);
  /**
   This is set up this way to avoid two modal open at the same time which causes  a bug
  It will first close which ever modal is open and then open a new one
  */
  const [openNextModal, setOpenNextModal] = useState(false); // Flag to open next modal after closing the first
  const [openWateringScheduleNext, setOpenWateringScheduleNext] = useState(false); // New flag for the watering schedule
  const [wateringScheduleModalVisible, setWateringScheduleModalVisible] = useState(false);
  const [menuModalVisible, setMenuModalVisible] = useState(false); //settings menu for each plant
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [openEditModalNext, setOpenEditModalNext] = useState(false); // Flag for opening edit modal after closing current
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);

  // Function to handle palette selection
  const handlePaletteChange = (palette) => {
    setSelectedPalette(palette);
    // Apply the selected palette to the theme
    // This will require a mechanism to update the theme dynamically
    // For now, we'll just log the selected palette
    //console.log(`Selected palette: ${palette}`);
  };

  /*
                    Modal Functions:
  These functions are for the modals to be opened one after the other
  if main menu is open and you click "rename plant" it will close the main menu and open the rename plant modal
  Necessary to avoid two modals being open at the same time, which causes a bug
   */
  
  
  const openMenuModal = () => {
    setOpenNextModal(true); // Set flag to open menu modal after main modal closes
    setModalVisible(false); // Close main modal
  };

  const handleWateringSchedule = () => {
    setOpenWateringScheduleNext(true); // Set flag to open watering schedule modal
    setMenuModalVisible(false); // Close the menu modal
  };

  // Function to open the rename plant modal
  const openRenameModal = () => {
    setOpenEditModalNext(true); // Set the flag to open the rename modal
    setMenuModalVisible(false); // Close the menu modal
  };

    //change photo modal
  const handleChangePhoto = () => {
    setMenuModalVisible(false); // Close the menu modal
    setTimeout(() => {
      handleAddPhotoPress(); // Start the photo selection process after a short delay
    }, 500); // Delay in milliseconds (adjust as needed)
  };
  /**End of dumb functions to close and open modals thx - if you find another solution for this go for it :)*/

  useFocusEffect(
    useCallback(() => {
      refreshImagesData();
    }, [])
  );


  //used for scrollview in plant modal:

  const [plantInfo, setPlantInfo] = useState<{
    description?: string;
    watering?: string;
    poisonousToHumans?: string;
    poisonousToPets?: string;
    scientificName?: string;
    family?: string;
    sunlight?: string;
    additionalCareTips?: string;//new
    whereToBuy?: string;
  } | null>(null);
  
/**
 * Function to handle the event when a plant image is clicked.
 * 
 * This function performs the following steps:
 * 1. Sets the selected image and displays the modal.
 * 2. Updates the plant information state with details from the selected image.
 * 3. Sets the recommended and user watering schedules.
 * 4. Initializes the seasonal watering inputs.
 * 5. Calculates and sets the next watering date based on the user schedule and last watered date.
 */

  const handleImageClick = (image: { 
    id: number, // Include id
    name: string, 
    uri: string, 
    species: string,
    description?: string,
    watering?: string,
    poisonousToHumans?: string,
    poisonousToPets?: string,
    scientificName?: string,
    family?: string,
    sunlight?: string,
    additionalCareTips?: string,
    whereToBuy?: string,
  }) => {
    //console.log("Selected Image ID:", image.id); // for debugging, show the selected plant id
    setSelectedImage(image);
    setModalVisible(true);
    setPlantInfo({
      description: image.description || 'Description not available',
      watering: image.watering || 'Watering information not available',
      poisonousToHumans: image.poisonousToHumans || 'toxicity not available',
      poisonousToPets: image.poisonousToPets || 'toxicity not available',
      scientificName: image.scientificName || 'Scientific name not available',
      family: image.family || 'Family information not available',
      sunlight: image.sunlight || 'Sunlight requirements not available',
      additionalCareTips: image.additionalCareTips || 'Additional care tips not available',
      whereToBuy: image.whereToBuy || 'Purchase information not available'
    
    });
      // Set watering schedule
      const recommendedSchedule = image.watering_schedule || null;
      const userSchedule = image.user_schedule || recommendedSchedule;
    
      setRecommendedWateringSchedule(recommendedSchedule);
      setUserWateringSchedule(userSchedule);
    //console.log('index.tsx/104.Plant Watering Schedule:', schedule);// for debugging, show the plant watering schedule
    
    // Initialize seasonal watering inputs
    setSpringSummerFrom(userSchedule?.spring_summer?.split(' ')[0] || '');
    setSpringSummerTo(userSchedule?.spring_summer?.split(' ')[1] || '');
    setFallWinterFrom(userSchedule?.fall_winter?.split(' ')[0] || '');
    setFallWinterTo(userSchedule?.fall_winter?.split(' ')[1] || '');

    // When setting lastWatered
    setLastWatered(image.lastWatered || null);
    
    // When calculating next watering date
    const nextDateInfo = calculateNextWateringDate(userSchedule, lastWatered);
    if (nextDateInfo) {
      setNextWateringDate(nextDateInfo.dueDate);
    } else {
      setNextWateringDate(null);
    }
  };
  


  const handleDeleteImage = () => {
    if (selectedImage) {
      Alert.alert(
        'Delete Image',
        'Are you sure you want to delete this image?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              deleteImage(selectedImage.id); // Use id of selected plant
              setImages(images.filter(image => image.id !== selectedImage.id)); // Filtering by id
              setModalVisible(false);
            },
          },
        ],
        { cancelable: true }
      );
    }
  };
  

    // these two are for the scrollview in the plant modal, it allows the user to scroll through the plant information
    const handleOnScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      setScrollOffset(event.nativeEvent.contentOffset.y);
    };
  
    const handleScrollTo = (p: { x?: number; y?: number; animated?: boolean }) => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo(p);
      }
    };
    
  

  const handleSort = (criteria: 'name' | 'species') => {
    const sortedImages = [...images].sort((a, b) => a[criteria].localeCompare(b[criteria]));
    setImages(sortedImages);
    setSortMenuVisible(false); // Close the menu after selection
  };

  /**Sorting menu */
  const openSortMenu = () => setSortMenuVisible(true);
  const closeSortMenu = () => setSortMenuVisible(false);


  /******************** Watering Functions start here ***********/

    const refreshImagesData = () => {
    getImages((fetchedImages) => {
      const updatedImages = fetchedImages.map((image) => {
        const userSchedule = image.user_schedule || image.watering_schedule || null;
        const lastWatered = image.lastWatered || null;
        const nextWateringInfo = calculateNextWateringDate(userSchedule, lastWatered);
        let daysUntilNextWatering = null;
  
        if (nextWateringInfo) {
          const today = new Date();
          const nextWatering = new Date(nextWateringInfo.dueDate);
          const diffTime = nextWatering.getTime() - today.getTime();
          daysUntilNextWatering = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }
  
        return {
          ...image,
          nextWateringDate: nextWateringInfo ? nextWateringInfo.dueDate : null,
          daysUntilNextWatering,
        };
      });
      setImages(updatedImages);
    });
  };
    const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return date.toDateString();
  };

/**
 * Function to calculate the next watering date based on the plant's watering schedule and last watered date.
 * 
 * This function performs the following steps:
 * 1. Determines the current season (spring/summer or fall/winter).
 * 2. Selects the appropriate watering frequency based on the season.
 * 3. Parses the frequency to calculate the next watering date.
 * 
 * @param schedule - An object containing the watering schedule for spring/summer and fall/winter.
 * @param lastWateredDate - A string representing the last date the plant was watered.
 * @returns An object containing the beginning watering date and the due date for the next watering, or null if the schedule or last watered date is not provided.
 */
  
  const calculateNextWateringDate = (
    schedule: { spring_summer?: string; fall_winter?: string },
    lastWateredDate: string
  ): { beginningWatering: string; dueDate: string } | null => {
    if (!schedule || !lastWateredDate) return null;
  
    // Determine the current season
    const month = new Date().getMonth(); // 0-11
    const isSpringSummer = month >= 2 && month <= 7; // March to August
    let frequency = isSpringSummer ? schedule.spring_summer : schedule.fall_winter;
  
    // Use spring_summer as default if fall_winter is null
    if (!frequency) {
      frequency = schedule.spring_summer;
    }
  
    if (!frequency) return null;
  
    // Parse the frequency and calculate the next watering date
    const result = parseFrequencyToDays(frequency, lastWateredDate);
    if (!result) return null;
  
    const { daysToAdd, beginningWatering, dueDate } = result;
    return { beginningWatering, dueDate };
  };


/**
 * Parses a watering frequency string and returns the average number of days.
 * 
 * This function performs the following steps:
 * 1. Converts the frequency string to lowercase for uniformity.
 * 2. Parses the last watered date and checks for validity.
 * 3. Determines the number of days to add based on the frequency string.
 * 4. Calculates the next watering date.
 * 
 * @param frequency - A string representing the watering frequency (e.g., "3-5 days", "1 week", "2 months").
 * @param lastWateredDate - A string representing the last date the plant was watered.
 * @returns An object containing the number of days to add, the beginning watering date, and the due date for the next watering, or null if the frequency or last watered date is not provided or invalid.
 */
  const parseFrequencyToDays = (
    frequency: string,
    lastWateredDate: string
  ): { daysToAdd: number; beginningWatering: string; dueDate: string } | null => {
    if (!frequency || !lastWateredDate) return null;
    frequency = frequency.toLowerCase();
  
    const lastWatered = new Date(lastWateredDate);
    if (isNaN(lastWatered.getTime())) return null; // Check for invalid date
  
    let daysToAdd: number | null = null;
    let beginningWatering = lastWatered.toISOString(); // ISO format
    let dueDate: string | null = null;
  
    if (frequency.includes('day')) {
      const match = frequency.match(/(\d+)(?:-(\d+))?\s*day/);
      if (match) {
        const minDays = parseInt(match[1], 10);
        const maxDays = match[2] ? parseInt(match[2], 10) : minDays;
        daysToAdd = Math.round((minDays + maxDays) / 2);
      }
    } else if (frequency.includes('week')) {
      const match = frequency.match(/(\d+)?\s*week/);
      const weeks = match[1] ? parseInt(match[1], 10) : 1;
      daysToAdd = weeks * 7;
    } else if (frequency.includes('month')) {
      const match = frequency.match(/(\d+)?\s*month/);
      const months = match[1] ? parseInt(match[1], 10) : 1;
      daysToAdd = months * 30; // Approximate a month as 30 days
    }
  
    if (daysToAdd !== null) {
      const nextWatering = new Date(lastWatered.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
      dueDate = nextWatering.toISOString(); // ISO format
    }
  
    return daysToAdd !== null && dueDate
      ? { daysToAdd, beginningWatering, dueDate }
      : null;
  };


/**
 * Function to handle the event when a plant is watered.
 * 
 * This function performs the following steps:
 * 1. Checks if a plant image is selected.
 * 2. Updates the last watered date in the database.
 * 3. Updates the state with the new last watered date.
 * 4. Calculates and sets the next watering date based on the user schedule.
 * 5. Alerts the user that the plant has been watered.
 * 6. Refreshes the images data to reflect the updated information.
 * 
 * @returns {Promise<void>}
 */

  const handleWaterPlant = async () => {
    if (selectedImage) {
      try {
        const currentDate = new Date().toISOString();
        await updateLastWatered(selectedImage.id, currentDate);
        setLastWatered(currentDate);
        setNextWateringDate(calculateNextWateringDate(userWateringSchedule, currentDate)?.dueDate || null);
        
        // Show success toast message
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Plant has been watered!',
        });

        // Refresh images data
        refreshImagesData();

        // Close the modal if desired
        // setModalVisible(false);
      } catch (error) {
        console.error('Error updating lastWatered:', error);
      }
    }
  };

/**
 * Function to handle saving the custom watering schedule for a plant.
 * 
 * This function performs the following steps:
 * 1. Formats the summer and winter schedules based on user inputs.
 * 2. Updates the watering schedule state with the formatted schedules.
 * 3. Updates the user schedule in the database for the selected plant.
 * 4. Recalculates and sets the next watering date based on the updated user schedule.
 * 5. Refreshes the images data to reflect the updated information.
 * 6. Displays a success message or handles any errors that occur during the update process.
 * 
 * @returns {Promise<void>}
 */

const handleSaveWateringSchedule = async () => {
  // Validate inputs
  if (!customSummerFrom) {
    setError('Summer "from" field is required.');
    return;
  }

  if (customSummerTo && parseInt(customSummerTo) <= parseInt(customSummerFrom)) {
    setError('Summer "to" field must be greater than "from" field.');
    return;
  }

  if (winterEnabled) {
    if (!customWinterFrom) {
      setError('Winter "from" field is required.');
      return;
    }

    if (customWinterTo && parseInt(customWinterTo) <= parseInt(customWinterFrom)) {
      setError('Winter "to" field must be greater than "from" field.');
      return;
    }
  }

  setError(null); // Clear any previous errors

  // Format summer and winter schedules with user inputs
  const summerSchedule = customSummerTo
    ? `${customSummerFrom}-${customSummerTo} ${summerUnit}`
    : `${customSummerFrom} ${summerUnit}`;
  const winterSchedule = winterEnabled
    ? customWinterTo
      ? `${customWinterFrom}-${customWinterTo} ${winterUnit}`
      : `${customWinterFrom} ${winterUnit}`
    : null;

  const userSchedule = { spring_summer: summerSchedule, fall_winter: winterSchedule };

  // Update the watering schedule state
  setUserWateringSchedule(userSchedule);

  if (selectedImage) {
    try {
      await updateUserSchedule(selectedImage.id, userSchedule);

      // Recalculate next watering date with the updated user schedule
      const nextDateInfo = calculateNextWateringDate(userSchedule, lastWatered);
      setNextWateringDate(nextDateInfo ? nextDateInfo.dueDate : null);

      // Refresh images data
      refreshImagesData();

      // Optionally show a success message
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Watering schedule updated successfully.',
      });
    } catch (error) {
      console.error('Error updating watering schedule:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update watering schedule. Please try again.',
      });
    }
  } else {
    alert('No plant selected.');
  }
};

    // Rename Plant Handler:

    // Update plant name in the database
    const updatePlantName = async (id, newName) => {
      try {
        //console.log(`Updating plant with ID ${id} to new name: ${newName}`);
        await updatePlantNameInDB(id, newName); // Call the database update function
        return true; // Return true if the update was successful.
      } catch (error) {
        console.error("index.updatePlantName - Failed to update plant name:", error);
        return false; // Return false if there was an error.
      }
    };
    

    const handleRenamePlant = async () => {
      if (selectedImage && newPlantName) {
        const success = await updatePlantName(selectedImage.id, newPlantName);
        if (success) {
          setImages((prev) =>
            prev.map((plant) =>
              plant.id === selectedImage.id ? { ...plant, name: newPlantName } : plant
            )
          );
          setEditModalVisible(false); // Close the rename modal
          setNewPlantName('');        // Clear the input field
        } else {
          Alert.alert("Error", "Failed to rename plant. Please try again.");
        }
      } else {
        Alert.alert("Error", "Please enter a valid name.");
      }
    };
    
    /* 
    From here we are handling the photo change
     */
    
    // Handle opening camera or gallery specific to platform
    const handleAddPhotoPress = () => {
      if (Platform.OS === 'ios') {
        ActionSheetIOS.showActionSheetWithOptions(
          {
            options: ['Cancel', 'Take a Photo', 'Open Gallery'],
            cancelButtonIndex: 0,
          },
          (buttonIndex) => {
            if (buttonIndex === 1) {
              openCamera();
            } else if (buttonIndex === 2) {
              openGallery();
            }
          }
        );
      } else {
        // Android and other platforms
        Alert.alert(
          'Choose an option',
          '',
          [
            { text: 'Take a Photo', onPress: openCamera },
            { text: 'Open Gallery', onPress: openGallery },
            { text: 'Cancel', style: 'cancel' },
          ],
          { cancelable: true }
        );
      }
    };

    // Open Camera
    const openCamera = async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera access is needed to take photos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        confirmReplacePhoto(uri);
      }
    };

    // Open Gallery
    const openGallery = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Gallery access is needed to select photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        confirmReplacePhoto(uri);
      }
    };

    //simple alert to confirm the user wants to replace the photo
    const confirmReplacePhoto = (newUri) => {
      Alert.alert(
        'Replace Picture?',
        'Are you sure you want to replace the current picture?',
        [
          { text: 'Yes', onPress: () => handleReplacePhoto(newUri) },
          { text: 'No', style: 'cancel' },
        ],
        { cancelable: true }
      );
    };

    // Replace the photo in the database and state
    const handleReplacePhoto = async (newUri) => {
      if (selectedImage) {
        // Update image in the database
        const success = await updatePlantImage(selectedImage.id, newUri);
        if (success) {
          // Update image in the state
          setImages((prev) =>
            prev.map((plant) =>
              plant.id === selectedImage.id ? { ...plant, uri: newUri } : plant
            )
          );
          // Update the selected image
          setSelectedImage((prev) => ({ ...prev, uri: newUri }));
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Plant image updated successfully.'
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Failed to update plant image. Please try again.'
          });
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'No plant selected.'
        });
      }
    };
    

      /* 
    End of handling the photo change
     */


  /* 
  #TODO:
  Buttons that still need to be implemented:
  */
  const handleSettingsPress = () => {
    setSettingsModalVisible(true);
  };

  // Function to handle dropping all tables with confirmation
  const handleDropTables = async () => {

    Alert.alert(
      'Remove All Data',
      'This will remove all of the data in your app, do you wish to continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          onPress: async () => {
            setSettingsModalVisible(false); // Close the modal

            try {
              await dropTables();
              Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'All data has been removed from the database.',
              });
              // Optionally, refresh the images data or reset state
              setImages([]);
            } catch (error) {
              console.error('Error dropping tables:', error);
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to remove data. Please try again.',
              });
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

    /**
   * The GardenScreen component renders the main UI for managing the user's garden.
   * StyleSheet is in app/res/styles/gardenStyles.ts
   * 
   * This includes:
   * 1. A top bar with a title and settings button.
   * 2. A sort menu for sorting plant images by name or species.
   * 3. A scrollable list of plant images, each clickable to view detailed information.
   * 4. Modals for viewing and editing plant details, setting watering schedules, and renaming plants.
   * 5. Various state variables and functions to handle user interactions and update the UI accordingly.
   */
  

  return (

    <View style={styles.container}>
      <TopBar title="My Garden" showSettings={true} onSettingsPress={handleSettingsPress} />
      <PaperProvider>

      {/* Sort Dropdown Menu */}
      <View style={styles.menuContainer}>
      <Menu
        visible={sortMenuVisible}
        onDismiss={closeSortMenu}
        anchor={
          <Button mode="contained" onPress={openSortMenu} style={styles.sortButton}>
            Sort
          </Button>
        }
      >
        <Menu.Item onPress={() => handleSort('name')} title="Sort by Name" />
        <Menu.Item onPress={() => handleSort('species')} title="Sort by Species" />
      </Menu>
    </View>

    <ScrollView contentContainerStyle={styles.scrollContainer}>
  {images.map((image, index) => (
    <TouchableOpacity key={index} onPress={() => handleImageClick(image)}>
      <View style={styles.plantContainer}>
        <Image source={{ uri: image.uri }} style={styles.plantImage} />
        <View style={styles.overlayContainer}>
          {/* set to 999 because more than 3 digits does not look good on the UI */}
          {image.daysUntilNextWatering != null && image.daysUntilNextWatering <= 999 && (
            <View style={styles.waterDropContainer}>
              <MaterialCommunityIcons
                name="water"
                style={[
                  styles.dropIcon,
                  { 
                    color: image.daysUntilNextWatering > 3 ? '#16b1e9' : image.daysUntilNextWatering > 0 ? '#5bb500' : '#ff5473',
                    fontSize: image.daysUntilNextWatering.toString().length > 2 ? 70 : image.daysUntilNextWatering.toString().length === 2 ? 60 : 50 // Adjust size based on text length
                  }
                ]}
              />
              <Text style={styles.dropText}>
                {image.daysUntilNextWatering}
              </Text>
            </View>
          )}
          <TouchableOpacity
            onPress={() => {
              setSelectedImage(image);
              setMenuModalVisible(true);
            }}
            style={styles.settingsButton}
          >
            <Text style={styles.settingsIcon}>⋮</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.plantTitle}>
          <Text style={styles.plantName}>{image.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  ))}
</ScrollView>


{/* Modal for full image view and plant information*/}

<Modal
  isVisible={modalVisible}
  onSwipeComplete={() => setModalVisible(false)}
  swipeDirection={['down']}
  scrollTo={handleScrollTo}
  scrollOffset={scrollOffset}
  propagateSwipe={true}
  scrollOffsetMax={400}
  style={styles.modalStyle}
  onBackdropPress={() => setModalVisible(false)}
  onModalHide={() => {
    if (openNextModal) {
      setOpenNextModal(false); // Reset flag
      setMenuModalVisible(true); // Open menu modal
    }

  }}
>

<View style={styles.modalContent}>
          {selectedImage && (
            <>
              <View style={styles.modalHeader}>
                <TouchableOpacity style={styles.topCloseButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.topCloseButtonText}>×</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuButton} onPress={openMenuModal}>
                  <Text style={styles.menuIconText}>...</Text>
                </TouchableOpacity>
              </View>




        <ScrollView
          ref={scrollViewRef}
          onScroll={handleOnScroll}
          scrollEventThrottle={16}
          contentContainerStyle={styles.scrollViewContent}
        >

{/* Plant image and information */}
          <Image source={{ uri: selectedImage.uri }} style={styles.fullImage} />

{/* Plant Name */}
<Text style={styles.plantNameText}>{selectedImage.name}</Text>

{/* Scientific Info Container */}
<View style={styles.infoContainer}>
  <Text style={styles.infoTitle}>Scientific Info</Text>
  <Text style={styles.modalText}>Species: {selectedImage.species}</Text>
  <Text style={styles.modalText}>Family: {plantInfo?.family}</Text>
  <Text style={styles.modalText}>Scientific Name: {plantInfo?.scientificName}</Text>
</View>

{/* Care Info Container */}
<View style={styles.infoContainer}>
  <Text style={styles.infoTitle}>Care</Text>
  <Text style={styles.modalText}>Sunlight: {plantInfo?.sunlight}</Text>
  <Text style={styles.modalText}>{plantInfo?.additionalCareTips}</Text>
  {/*<Text style={styles.modalText}>Water every: {plantInfo?.wateringValue} {plantInfo?.wateringUnit}</Text> took this out*/}
</View>
  
  {/* Where To Buy */}
<View style={styles.infoContainer}>
  <Text style={styles.infoTitle}>Where To Buy</Text>
  <Text style={styles.modalText}>{plantInfo?.whereToBuy}</Text>
</View>

  {/* Watering Info Container */}
<View style={styles.infoContainer}>
  <Text style={styles.infoTitle}>Watering</Text>
  <Text style={styles.modalText}>{plantInfo?.watering}</Text>

  <View style={styles.divider} />
  <Text style={styles.modalsubText}>Last watered on:</Text>
  <Text style={styles.modalText}>
    {lastWatered ? formatDate(lastWatered) : 'Not recorded'}
  </Text>
  <Text style={styles.modalsubText}>Next watering due on:</Text>
  <Text style={styles.modalText}>
    {nextWateringDate ? formatDate(nextWateringDate) : 'Cannot calculate'}
  </Text>


</View>

{/* Toxicity Info Container */}
<View style={styles.infoContainer}>
  <Text style={styles.infoTitle}>Toxicity</Text>
  <Text style={styles.modalText}>Humans: {plantInfo?.poisonousToHumans} </Text>
  <Text style={styles.modalText}>Pets: {plantInfo?.poisonousToPets} </Text>
</View>

{/* Description */}
<View style={styles.infoContainer}>
  <Text style={styles.infoTitle}>Description</Text>
  <Text style={styles.modalText}>{plantInfo?.description}</Text>
</View>



        </ScrollView>

        <View style={styles.modalButtonContainer}>

          <TouchableOpacity style={styles.deleteButton} onPress={handleWaterPlant}>
            <Text style={styles.deleteButtonText}>Water Plant</Text>
          </TouchableOpacity>

        </View>
      </>
    )}
  </View>
</Modal>

      {/*
      Separate Menu Modal for Rename Plant, Change Photo, Water Plant, Set Watering Schedule, and Delete Plant
      */}
        <Modal
            isVisible={menuModalVisible}
            onBackdropPress={() => setMenuModalVisible(false)}
            swipeDirection="down"
            onSwipeComplete={() => setMenuModalVisible(false)}
            style={styles.modalStyle}
            onModalHide={() => {
              if (openWateringScheduleNext) {
                setOpenWateringScheduleNext(false); // Reset flag
                setWateringScheduleModalVisible(true); // Open watering schedule modal
              }
              if (openEditModalNext) {
                setOpenEditModalNext(false); // Reset the flag
                setEditModalVisible(true);   // Open the rename modal
              }
            }}
        >
          <View style={styles.menuModalContainer}>
            {/* Display Plant Image and Name */}
            {selectedImage && (
              <View style={styles.selectedPlantContainer}>
                <Image source={{ uri: selectedImage.uri }} style={styles.selectedPlantImage} />
                <Text style={styles.selectedPlantName}>{selectedImage.name}</Text>
              </View>
            )}

          {/* Menu Items */}          
          <TouchableOpacity onPress={openRenameModal} style={styles.menuItem}>
            <Text style={styles.menuItemText}>Rename Plant</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleChangePhoto} style={styles.menuItem}>
            <Text style={styles.menuItemText}>Change Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { handleWaterPlant(); setMenuModalVisible(false); }} style={styles.menuItem}>
            <Text style={styles.menuItemText}>Water Plant</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => { handleWateringSchedule(); setMenuModalVisible(false); }} style={styles.menuItem}>
            <Text style={styles.menuItemText}>Set Watering Schedule</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { handleDeleteImage(); setMenuModalVisible(false); }} style={styles.menuItem}>
            <Text style={styles.menuItemText}>Delete Plant</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMenuModalVisible(false)} style={styles.menuItem}>
            <Text style={styles.menuItemText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>


      {/* Watering Schedule Modal */}

      <Modal
  isVisible={wateringScheduleModalVisible}
  //swipeDirection="down"
  //onSwipeComplete={() => setWateringScheduleModalVisible(false)}
  //this makes it swipe down to close I would recommend keeping it as is, it causes issues with scrolling
  animationIn={'fadeIn'}
  animationOut={'fadeOut'}
  onBackdropPress={() => setWateringScheduleModalVisible(false)}
  style={styles.modalStyle}
>
  <ScrollView style={styles.wateringModalContent}>
    <View style={styles.modalHeader}>
      <Text style={styles.heading}>Set Custom Watering Schedule</Text>
    </View>

    {/* Display Recommended Watering Schedule */}
    <View style={styles.infoContainer}>
      <Text style={styles.infoTitle}>Recommended Watering</Text>
      <Text style={styles.modalText}>
        Summer: water every {recommendedWateringSchedule?.spring_summer || 'Not set'}
      </Text>
      <Text style={styles.modalText}>
        Winter: water every {recommendedWateringSchedule?.fall_winter || 'Not set'}
      </Text>
    </View>
    
    {/* Current Watering Schedule */}
    <View style={styles.infoContainer}>
      <Text style={styles.infoTitle}>Current Watering Schedule</Text>
      <Text style={styles.modalText}>
        Summer: water every {userWateringSchedule?.spring_summer || 'Not set'}
      </Text>
      <Text style={styles.modalText}>
        Winter: water every {userWateringSchedule?.fall_winter || 'Not set'}
      </Text>
      <View style={styles.divider} />
    
      <Text style={styles.modalsubText}>Last watered on:</Text>
      <Text style={styles.modalText}>
        {lastWatered ? new Date(lastWatered).toDateString() : 'Not recorded'}
      </Text>
      <Text style={styles.modalsubText}>Next watering due on:</Text>
      <Text style={styles.modalText}>
        {nextWateringDate ? new Date(nextWateringDate).toDateString() : 'Cannot calculate'}
      </Text>
    </View>

    {/* Custom Summer Schedule Input */}
    <View style={styles.infoContainer}>
      <Text style={styles.infoTitle}>Summer</Text>
      <Text style={styles.modalsubText}>Water every</Text>

      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder=""
          keyboardType="numeric"
          value={customSummerFrom}
          onChangeText={setCustomSummerFrom}
        />
        <Text>to</Text>
        <TextInput
          style={styles.input}
          placeholder="optional"
          keyboardType="numeric"
          value={customSummerTo}
          onChangeText={setCustomSummerTo}
        />
        <Picker
          selectedValue={summerUnit}
          style={styles.picker}
          onValueChange={(itemValue) => setSummerUnit(itemValue)}
        >
          <Picker.Item label="day(s)" value="day" />
          <Picker.Item label="week(s)" value="week" />
          <Picker.Item label="month(s)" value="month" />
        </Picker>
      </View>
    </View>

    {/* Custom Winter Schedule Input with Switch */}
    <View style={styles.infoContainer}>
      <View style={styles.winterRow}>
        <Text style={styles.infoTitle}>Winter</Text>
        <Switch
          value={winterEnabled}
          onValueChange={(value) => setWinterEnabled(value)}
        />
      </View>
      {winterEnabled && (
        <View style={styles.row}>
      <TextInput
            style={styles.input}
            placeholder=""
            keyboardType="numeric"
            value={customWinterFrom}
            onChangeText={setCustomWinterFrom}
          />
          <Text>to</Text>
          <TextInput
            style={styles.input}
            placeholder="optional"
            keyboardType="numeric"
            value={customWinterTo}
            onChangeText={setCustomWinterTo}
          />

          <Picker
            selectedValue={winterUnit}
            style={styles.picker}
            onValueChange={(itemValue) => setWinterUnit(itemValue)}
          >
            <Picker.Item label="day(s)" value="day" />
            <Picker.Item label="week(s)" value="week" />
            <Picker.Item label="month(s)" value="month" />
          </Picker>
        </View>
      )}
    </View>

  {/* Display error message if any */}
  {error && (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>{error}</Text>
    </View>
  )}
  
    <View style={styles.winterFooter}>
      {/* Winter Schedule Footer */}
    </View>
  </ScrollView>


  {/* Action Buttons */}
  <View style={styles.modalFooter}>
    <TouchableOpacity style={styles.wateringCancelButton} onPress={() => setWateringScheduleModalVisible(false)}>
      <Text style={styles.buttonText}>Cancel</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.wateringSaveButton} onPress={handleSaveWateringSchedule}>
      <Text style={styles.buttonText}>Save</Text>
    </TouchableOpacity>
  </View>
</Modal>





      {/* End of Watering Schedule Modal */}

      {/* Edit Plant Modal */}
      <Modal
        isVisible={editModalVisible}
        onBackdropPress={() => setEditModalVisible(false)}
        swipeDirection="down"
        onSwipeComplete={() => setEditModalVisible(false)}
        style={styles.modalStyle}
      >
        <View style={styles.renameModalContainer}>
          <View style={styles.renameModalContent}>
            <Text style={styles.renameModalTitle}>Rename Plant</Text>
            <TextInput
              placeholder="Enter new plant name"
              value={newPlantName}
              onChangeText={setNewPlantName}
              style={styles.textInput}
            />
            <View style={styles.settmodalButtonContainer}>
              <TouchableOpacity onPress={handleRenamePlant} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setEditModalVisible(false)} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* End of Edit Plant Modal */}

      {/* Add the Settings Modal */}
      <Modal
        isVisible={settingsModalVisible}
        onBackdropPress={() => setSettingsModalVisible(false)}
        swipeDirection="down"
        onSwipeComplete={() => setSettingsModalVisible(false)}
        style={styles.modalStyle}
      >
        <View style={styles.settingsModalContainer}>
          <Text style={styles.modalTitleSettings}>Settings</Text>
          <Text style={styles.modalSubtitle}>Select Theme</Text>
          <View style={styles.paletteContainer}>
            {Object.keys(ColorPalettes).map((palette) => (
              <TouchableOpacity
                key={palette}
                style={[
                  styles.paletteOption,
                  { backgroundColor: getPaletteColor(palette) }, // Set background color to '500' color of the palette
                  selectedPalette === palette && styles.selectedPaletteOption,
                ]}
                onPress={() => handlePaletteChange(palette)}
              >
                <Text style={styles.paletteText}>{palette}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.settingsModalButtonsContainer}>
          <TouchableOpacity
            onPress={handleDropTables}
            style={[styles.modalButtonRemove, styles.settingsModalButton]} // Apply new button style
          >
            <Text style={styles.modalButtonTextRemove}>Remove All Data</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSettingsModalVisible(false)}
            style={styles.modalButton}
          >
            <Text style={styles.modalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
        </View>
      </Modal>

{/* 
End of Garden Screen 
everything should be contained within this View and Paper Provider*/}
    </PaperProvider>

    </View>

  );
}