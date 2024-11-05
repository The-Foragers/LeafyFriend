import React, { useCallback, useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert, NativeSyntheticEvent, NativeScrollEvent, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getImages, deleteImage } from '@/app/utils/database';
import TopBar from '@/components/TopBar';
import { Button, Menu, Provider as PaperProvider, useTheme } from 'react-native-paper';
import { makeStyles } from '@/app/res/styles/gardenStyles'; // Import the styles
import Modal from 'react-native-modal';
import Icon from 'react-native-ionicons';


export default function GardenScreen() {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const [images, setImages] = useState<{ name: string, uri: string, species: string }[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ name: string, uri: string, species: string } | null>(null);
  const [sortMenuVisible, setSortMenuVisible,] = useState(false);
  const {width, height } = Dimensions.get('window');
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [scrollOffset, setScrollOffset] = useState(0);
    /**
     This is set up this way to avoid two modal open at the same time which causes  a bug
     It will first close which ever modal is open and then open a new one
     */
    const [menuModalVisible, setMenuModalVisible] = useState(false);
    const [openNextModal, setOpenNextModal] = useState(false); // Flag to open next modal after closing the first

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
  
  useFocusEffect(
    useCallback(() => {
      getImages(setImages);
    }, [])
  );

  const handleImageClick = (image: { 
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
    additionalCareTips?: string,//new
  }) => {
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
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              deleteImage(selectedImage.uri);
              setImages(images.filter(image => image.uri !== selectedImage.uri));
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
  #TODO:
  Buttons that still need to be implemented:
  */
  const handleSettingsPress = () => {
    alert('Settings button pressed');
  };

  const handleRenamePlant = () => {
    // Logic to rename the plant
    alert('Rename Plant selected');
  };
  const handleWaterPlant = () => {
    // Logic to rename the plant
    alert('Plant Watered');
  };
  const handleWateringSchedule = () => {
    // Logic to rename the plant
    alert('Rename Plant selected');
  };
  const handleChangePhoto = () => {
    // Logic to change the plant photo
    alert('Change Photo selected');
  };
  

  return (
    <PaperProvider>

    <View style={styles.container}>
      <TopBar title="My Garden" showSettings={true} onSettingsPress={handleSettingsPress} />

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

      {/* Separate Menu Modal */}
      <Modal
          isVisible={menuModalVisible}
          onBackdropPress={() => setMenuModalVisible(false)}
          swipeDirection="down" // Enable swipe-to-close
          onSwipeComplete={() => setMenuModalVisible(false)} // Close on swipe
          style={styles.modalStyle} // Use the same modalStyle for positioning
        >

        <View style={styles.menuModalContainer}>
          <TouchableOpacity onPress={() => { handleRenamePlant(); setMenuModalVisible(false); }} style={styles.menuItem}>
            <Text style={styles.menuItemText}>Rename Plant</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { handleChangePhoto(); setMenuModalVisible(false); }} style={styles.menuItem}>
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

{/* 
End of Garden Screen 
everything should be contained within the View and Paper Provider*/}
    </View>
    </PaperProvider>

  );
}