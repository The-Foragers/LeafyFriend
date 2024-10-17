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


  useFocusEffect(
    useCallback(() => {
      getImages(setImages);
    }, [])
  );

const handleImageClick = (image) => {
  setSelectedImage(image);
  setModalVisible(true);
   // Reset species data
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
      {/*<Text style={styles.heading}>My Garden</Text>*/}

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
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          {selectedImage && (
            <>
              <Image source={{ uri: selectedImage.uri }} style={styles.fullImage} />
              <Text style={styles.modalText}>Plant Species: {selectedImage.species}</Text>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={handleDeleteImage}
                >
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