import React, { useCallback, useState, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { updateLastWatered, getImages, deleteImage, updatePlantName as updatePlantNameInDB, updatePlantImage } from '@/app/utils/database';
import TopBar from '@/components/TopBar';
import { Button, Menu, Provider as PaperProvider, useTheme } from 'react-native-paper';
import { makeStyles } from '@/app/res/styles/gardenStyles'; // Import the styles
import Modal from 'react-native-modal';
import * as ImagePicker from 'expo-image-picker';
import { 
  View, Text, TextInput, StyleSheet, Image, ScrollView, ActionSheetIOS, Platform,
  TouchableOpacity, Alert, NativeSyntheticEvent, NativeScrollEvent, Dimensions, Switch 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';



export default function GardenScreen() {
  // themes and styles and UI
  const theme = useTheme();
  const styles = makeStyles(theme);
  const {width, height } = Dimensions.get('window');
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [scrollOffset, setScrollOffset] = useState(0);

  const [images, setImages] = useState<{ id: number; name: string; uri: string; species: string }[]>([]);

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
      getImages(setImages);
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
  } | null>(null);
  
//when you click a plant image

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
      additionalCareTips: image.additionalCareTips || 'Additional care tips not available' //new
      
    });
      // Set watering schedule
    const schedule = image.watering_schedule || null;
    setPlantWateringSchedule(schedule);
    //console.log('index.tsx/104.Plant Watering Schedule:', schedule);// for debugging, show the plant watering schedule
    
    // Initialize seasonal watering inputs
    setSpringSummerFrom(schedule?.spring_summer?.split(' ')[0] || '');
    setSpringSummerTo(schedule?.spring_summer?.split(' ')[1] || '');
    setFallWinterFrom(schedule?.fall_winter?.split(' ')[0] || '');
    setFallWinterTo(schedule?.fall_winter?.split(' ')[1] || '');

    // Set last watered date
    setLastWatered(image.lastWatered || null);

    // Calculate next watering date
    const nextDate = calculateNextWateringDate(schedule, image.lastWatered);
    setNextWateringDate(nextDate);
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

  /**
   * Will calculate the next watering date based on the plant's watering schedule and last watered date.
   * @param schedule 
   * @param lastWateredDate 
   */
  const calculateNextWateringDate = (schedule, lastWateredDate) => {
    if (!schedule || !lastWateredDate) return null;
  
    // Determine the current season
    const month = new Date().getMonth(); // 0-11
    const isSpringSummer = month >= 2 && month <= 7; // March to August
    const frequency = isSpringSummer ? schedule.spring_summer : schedule.fall_winter;
  
    if (!frequency) return null;
  
    // Parse the frequency (e.g., '7-10 days', 'once a week')
    let daysToAdd = parseFrequencyToDays(frequency);
    if (!daysToAdd) return null;
  
    const lastWatered = new Date(lastWateredDate);
    const nextWatering = new Date(lastWatered.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
    return nextWatering.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

  /*
    * Parses a watering frequency string and returns the average number of days.
    * @param frequency 
    */
  
  const parseFrequencyToDays = (frequency) => {
    if (!frequency) return null;
    frequency = frequency.toLowerCase();
  
    if (frequency.includes('day')) {
      const match = frequency.match(/(\d+)-?(\d+)?\s*day/);
      if (match) {
        const minDays = parseInt(match[1], 10);
        const maxDays = match[2] ? parseInt(match[2], 10) : minDays;
        return Math.round((minDays + maxDays) / 2);
      }
    } else if (frequency.includes('week')) {
      const match = frequency.match(/(\d+)?\s*week/);
      const weeks = match[1] ? parseInt(match[1], 10) : 1;
      return weeks * 7;
    } else if (frequency.includes('month')) {
      return 30; // Approximate a month as 30 days
    }
  
    return null;
  };
  
  const handleWaterPlant = async () => {
    if (selectedImage) {
      const currentDate = new Date().toISOString();
  
      // Update the database
      await updateLastWatered(selectedImage.id, currentDate);
  
      // Update state
      setLastWatered(currentDate);
  
      // Recalculate next watering date
      const nextDate = calculateNextWateringDate(plantWateringSchedule, currentDate);
      setNextWateringDate(nextDate);
  
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Plant has been marked as watered.'
      });
      }
  };

  const handleSaveWateringSchedule = () => {
    // Format summer and winter schedules with user inputs
    const summerSchedule = customSummerTo
      ? `${customSummerFrom}-${customSummerTo} ${summerUnit}`
      : `${customSummerFrom} ${summerUnit}`;
    const winterSchedule = winterEnabled
      ? customWinterTo
        ? `${customWinterFrom}-${customWinterTo} ${winterUnit}`
        : `${customWinterFrom} ${winterUnit}`
      : null;
  
    // Update the watering schedule
    setPlantWateringSchedule({ spring_summer: summerSchedule, fall_winter: winterSchedule });
  
    // Calculate next watering date with the updated schedule
    const nextDate = calculateNextWateringDate(
      { spring_summer: summerSchedule, fall_winter: winterSchedule },
      lastWatered
    );
    setNextWateringDate(nextDate);
  
    setWateringScheduleModalVisible(false);
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
    alert('Settings button pressed');
  };


  
  


  

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
              <Text style={styles.plantName}>{image.name}</Text>
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
  
  {/* Watering Info Container */}
<View style={styles.infoContainer}>
  <Text style={styles.infoTitle}>Watering</Text>
  <Text style={styles.modalText}>{plantInfo?.watering}</Text>

  <View style={styles.divider} />
  <Text style={styles.modalsubText}>Last watered on:</Text>
  <Text style={styles.modalText}>{lastWatered ? new Date(lastWatered).toDateString() : 'Not recorded'}</Text>
  <Text style={styles.modalsubText}>Next watering due on:</Text>
  <Text style={styles.modalText}>{nextWateringDate ? new Date(nextWateringDate).toDateString() : 'Cannot calculate'}</Text>


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
  animationIn="fadeIn"
  animationOut="fadeOut"
  onBackdropPress={() => setWateringScheduleModalVisible(false)}
  style={styles.modalStyle}
>
  <View style={styles.wateringModalContent}>
    <View style={styles.modalHeader}>
      <Text style={styles.heading}>Set Custom Watering Schedule</Text>
    </View>

    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Recommended Watering Schedule Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recommended Watering Schedule</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Summer: {plantWateringSchedule?.spring_summer || 'Not set'}</Text>
        <Text style={styles.infoTitle}>Winter: {plantWateringSchedule?.fall_winter || 'Not set'}</Text>
      </View>

      {/* Custom Summer Schedule Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Custom Summer Schedule</Text>
      </View>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Days From"
          keyboardType="numeric"
          value={customSummerFrom}
          onChangeText={setCustomSummerFrom}
        />
        <Text style={styles.toText}>to</Text>
        <TextInput
          style={styles.input}
          placeholder="Days To (optional)"
          keyboardType="numeric"
          value={customSummerTo}
          onChangeText={setCustomSummerTo}
        />
      </View>
      <View style={styles.unitSelector}>
        <Text>Unit:</Text>
        <Picker
          selectedValue={summerUnit}
          style={styles.picker}
          onValueChange={(itemValue) => setSummerUnit(itemValue)}
        >
          <Picker.Item label="Days" value="day" />
          <Picker.Item label="Weeks" value="week" />
          <Picker.Item label="Months" value="month" />
        </Picker>
      </View>

      {/* Custom Winter Schedule Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Custom Winter Schedule</Text>
      </View>
      <Switch
        value={winterEnabled}
        onValueChange={(value) => setWinterEnabled(value)}
        style={styles.winterToggle}
      />
      {winterEnabled && (
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Days From"
            keyboardType="numeric"
            value={customWinterFrom}
            onChangeText={setCustomWinterFrom}
          />
          <Text style={styles.toText}>to</Text>
          <TextInput
            style={styles.input}
            placeholder="Days To (optional)"
            keyboardType="numeric"
            value={customWinterTo}
            onChangeText={setCustomWinterTo}
          />
          <Picker
            selectedValue={winterUnit}
            style={styles.picker}
            onValueChange={(itemValue) => setWinterUnit(itemValue)}
          >
            <Picker.Item label="Days" value="day" />
            <Picker.Item label="Weeks" value="week" />
            <Picker.Item label="Months" value="month" />
          </Picker>
        </View>
      )}
    </ScrollView>

    {/* Action Buttons */}
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.cancelButton} onPress={() => setWateringScheduleModalVisible(false)}>
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
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

{/* 
End of Garden Screen 
everything should be contained within this View and Paper Provider*/}
    </PaperProvider>

    </View>

  );
}