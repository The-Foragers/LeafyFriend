import React, { useCallback, useState, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getImages, deleteImage, updatePlantName as updatePlantNameInDB, updatePlantImage } from '@/app/utils/database';
import TopBar from '@/components/TopBar';
import { Button, Menu, Provider as PaperProvider, useTheme } from 'react-native-paper';
import { makeStyles } from '@/app/res/styles/gardenStyles'; // Import the styles
import Modal from 'react-native-modal';
import Icon from 'react-native-ionicons';
import * as ImagePicker from 'expo-image-picker';
import { 
  View, Text, TextInput, StyleSheet, Image, ScrollView, ActionSheetIOS,Platform,
  TouchableOpacity, Alert, NativeSyntheticEvent, NativeScrollEvent, Dimensions 
} from 'react-native';


export default function GardenScreen() {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const [images, setImages] = useState<{ id: number; name: string; uri: string; species: string }[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [sortMenuVisible, setSortMenuVisible,] = useState(false);
  const {width, height } = Dimensions.get('window');
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [scrollOffset, setScrollOffset] = useState(0);
    /**
     This is set up this way to avoid two modal open at the same time which causes  a bug
     It will first close which ever modal is open and then open a new one
     */
    const [openNextModal, setOpenNextModal] = useState(false); // Flag to open next modal after closing the first
    /*Modal, modal and more modal */
    const [openWateringScheduleNext, setOpenWateringScheduleNext] = useState(false); // New flag for the watering schedule
    const [wateringScheduleModalVisible, setWateringScheduleModalVisible] = useState(false);
    const [menuModalVisible, setMenuModalVisible] = useState(false); //settings menu for each plant

    /*To allow user to change plant images after saving to garden */
    const [selectedImage, setSelectedImage] = useState<{ id: number; name: string; uri: string; species: string } | null>(null);
    const [newPlantName, setNewPlantName] = useState('');
    const [newImageUri, setNewImageUri] = useState('');
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [openEditModalNext, setOpenEditModalNext] = useState(false); // Flag for opening edit modal after closing current
    
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
    console.log("Selected Image ID:", image.id); // Now image.id is defined
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
              deleteImage(selectedImage.id); // Use id
              setImages(images.filter(image => image.id !== selectedImage.id)); // Filtering by id
              setModalVisible(false);
            },
          },
        ],
        { cancelable: true }
      );
    }
  };
  

    //
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

  const openSortMenu = () => setSortMenuVisible(true);
  const closeSortMenu = () => setSortMenuVisible(false);

  // Function to open the menu modal after closing the main modal
  const openMenuModal = () => {
    setOpenNextModal(true); // Set flag to open menu modal after main modal closes
    setModalVisible(false); // Close main modal
  };
  
  /*
   * Watering Schedule Modal
   */
  const handleWateringSchedule = () => {
    setOpenWateringScheduleNext(true); // Set flag to open watering schedule modal
    setMenuModalVisible(false); // Close the menu modal
  };
  

// Function to open the rename modal
const openRenameModal = () => {
  setOpenEditModalNext(true); // Set the flag to open the rename modal
  setMenuModalVisible(false); // Close the menu modal
};

    // Rename Plant Handler

    // Update plant name in the database
    const updatePlantName = async (id, newName) => {
      try {
        console.log(`Updating plant with ID ${id} to new name: ${newName}`);
        await updatePlantNameInDB(id, newName); // Call the database update function
        return true; // Return true if the update was successful.
      } catch (error) {
        console.error("Failed to update plant name:", error);
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
          Alert.alert('Success', 'Plant image updated successfully.');
        } else {
          Alert.alert('Error', 'Failed to update plant image. Please try again.');
        }
      } else {
        Alert.alert('Error', 'No plant selected.');
      }
    };
    

    const handleChangePhoto = () => {
      setMenuModalVisible(false); // Close the menu modal
      setTimeout(() => {
        handleAddPhotoPress(); // Start the photo selection process after a short delay
      }, 500); // Delay in milliseconds (adjust as needed)
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

  const handleWaterPlant = () => {
    // Logic to rename the plant
    alert('Plant Watered');
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

          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteImage}>
            <Text style={styles.deleteButtonText}>Delete</Text>
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
        onBackdropPress={() => setWateringScheduleModalVisible(false)}
        swipeDirection="down"
        onSwipeComplete={() => setWateringScheduleModalVisible(false)}
        style={styles.modalStyle}
      >
        <View style={styles.modalContent}>
          <Text style={styles.heading}>Set Watering Schedule</Text>
          <Text style={styles.modalText}>This is where you'll configure your watering schedule.</Text>
          <TouchableOpacity onPress={() => setWateringScheduleModalVisible(false)} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
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
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={handleRenamePlant} style={styles.button}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setEditModalVisible(false)} style={styles.button}>
                <Text style={styles.buttonText}>Cancel</Text>
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