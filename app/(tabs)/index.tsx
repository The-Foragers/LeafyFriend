import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Modal, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import { getImages, deleteImage } from '@/app/utils/database';
import TopBar from '@/components/TopBar';
import { useTheme } from 'react-native-paper';
import { makeStyles } from '@/app/res/styles/gardenStyles';
import { fetchPlantInfoBySpecies } from '@/scripts/perenual';
import { fetchPlantInfoByID } from '@/scripts/perenual2';


export default function GardenScreen() {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const [images, setImages] = useState<{ name: string, uri: string, species: string }[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ name: string, uri: string, species: string } | null>(null);
  const [loadingSpecies, setLoadingSpecies] = useState(false);
  const [speciesData, setSpeciesData] = useState(null);
  const [showSpeciesData, setShowSpeciesData] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getImages(setImages);
    }, [])
  );

const handleImageClick = async (image) => {
    setSelectedImage(image);
    setModalVisible(true);
    setLoadingSpecies(true);

    try {
      // First API call to fetch species info by species name
      const speciesInfo = await fetchPlantInfoBySpecies(image.species);

      if (speciesInfo && speciesInfo.data && speciesInfo.data.length > 0) {
        const speciesId = speciesInfo.data[0].id; // Get the species ID from the first API response

        // Second API call to fetch detailed plant info by species ID
        const detailedSpeciesInfo = await fetchPlantInfoByID(speciesId);

        // Set the detailed species data to state
        setSpeciesData(detailedSpeciesInfo);
      } else {
        setSpeciesData(null); // No species data found
      }
    } catch (error) {
            console.error("Error fetching species data:", error);
            Alert.alert('Error', 'Unable to fetch species data. Please try again.');
            setSpeciesData(null);
          } finally {
            setLoadingSpecies(false);
    }
  };
const handleToggleSpeciesData = () => {
    setShowSpeciesData((prev) => !prev); // Toggle the species data visibility
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

  const handleSettingsPress = () => {
    alert('Settings button pressed');
  };

  return (
    <View style={styles.container}>
      <TopBar title="My Garden" showSettings={true} onSettingsPress={handleSettingsPress} />
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.modalView}>
          {selectedImage && (
            <>
              <Image source={{ uri: selectedImage.uri }} style={styles.fullImage} />
              <Text style={styles.modalText}>Plant Species: {selectedImage.species}</Text>

               {loadingSpecies ? (
              <ActivityIndicator size="large" color={theme.colors.primary} />
            ) : (
              <>

                  <Text style={styles.speciesToggleButtonText}>Show Species Info</Text>


                {showSpeciesData && speciesData ? ( // Show species data if toggle is active
                  <ScrollView style={styles.speciesDataContainer}>
                    <Text style={styles.modalText}>Poisonous to Humans: {speciesData.poisonousToHumans ? 'Yes' : 'No'}</Text>
                    <Text style={styles.modalText}>Poisonous to Pets: {speciesData.poisonousToPets ? 'Yes' : 'No'}</Text>
                    <Text style={styles.modalText}>Species: {speciesData.common_name}</Text>
                    <Text style={styles.modalText}>Scientific Name: {speciesData.scientific_name}</Text>
                    <Text style={styles.modalText}>Family: {speciesData.family}</Text>
                    <Text style={styles.modalText}>Watering: {speciesData.watering}</Text>
                    <Text style={styles.modalText}>Sunlight: {speciesData.sunlight}</Text>

                  </ScrollView>
                ) : (
                  showSpeciesData && <Text>No species data found.</Text> // Show if toggle is active but no data
                )}
              </>
            )}

              <View style={styles.modalButtonContainer}>
                <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(!modalVisible)}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteImage}>
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </Modal>
    </View>
  );
}