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
  const [modalMenuVisible, setModalMenuVisible] = useState(false);
  const {width, height } = Dimensions.get('window');

  //used for scrollview in plant modal:
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [scrollOffset, setScrollOffset] = useState(0);
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
  
  const handleChangePhoto = () => {
    // Logic to change the plant photo
    alert('Change Photo selected');
  };
  

  return (
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
<PaperProvider>

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
>
  <View style={styles.modalContent}>
    {selectedImage && (
      <>

{/* Modal Header with Close Button and Menu */}
<View style={styles.modalHeader}>
  {/* Close Button on the Left */}
  <TouchableOpacity style={styles.topCloseButton} onPress={() => setModalVisible(false)}>
    <Text style={styles.topCloseButtonText}>×</Text>
  </TouchableOpacity>

  {/* Three-Dot Menu on the Right */}
  <Menu
    visible={modalMenuVisible}
    onDismiss={() => setModalMenuVisible(false)}
    anchor={
      <TouchableOpacity style={styles.menuButton} onPress={() => setModalMenuVisible(true)}>
        <Text style={styles.menuIconText}>...</Text>
      </TouchableOpacity>
    }
  >
    <Menu.Item onPress={handleRenamePlant} title="Rename Plant" />
    <Menu.Item onPress={handleChangePhoto} title="Change Photo" />
    <Menu.Item onPress={handleDeleteImage} title="Delete Plant" />
  </Menu>
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
  <Text style={styles.modalText}>Watering: {plantInfo?.watering}</Text>
  <Text style={styles.modalText}>Additional Care Tips: {plantInfo?.additionalCareTips}</Text>
  {/*<Text style={styles.modalText}>Water every: {plantInfo?.wateringValue} {plantInfo?.wateringUnit}</Text> took this out*/}
</View>

{/* Toxicity Info Container */}
<View style={styles.infoContainer}>
  <Text style={styles.infoTitle}>Toxicity</Text>
  <Text style={styles.modalText}>Poisonous to Humans: {plantInfo?.poisonousToHumans} </Text>
  <Text style={styles.modalText}>Poisonous to Pets: {plantInfo?.poisonousToPets} </Text>
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
</PaperProvider>




{      /* End of Garden Screen */}
    </View>
  );
}