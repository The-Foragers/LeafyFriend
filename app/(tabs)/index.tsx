import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Modal, TouchableOpacity, Alert } from 'react-native';
import { useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { getImages, deleteImage } from '@/app/utils/database';
import TopBar from '@/components/TopBar';



export default function GardenScreen() {
  const [images, setImages] = useState<{ name: string, uri: string }[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ name: string, uri: string } | null>(null);

  useFocusEffect(
    useCallback(() => {
      getImages(setImages);
    }, [])
  );

  const handleImageClick = (image: { name: string, uri: string }) => {
    setSelectedImage(image);
    setModalVisible(true);
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
              // Delete the image from the database
              deleteImage(selectedImage.uri);
              // Update the images state
              setImages(images.filter(image => image.uri !== selectedImage.uri));
              // Close the modal
              setModalVisible(false);
            },
          },
        ],
        { cancelable: true }
      );
    }
  };

  const handleSettingsPress = () => {
    // Handle the settings button press here (e.g., navigate to settings screen)
    alert('Settings button pressed');
  };

  return (
    <View style={styles.container}>
      <TopBar title="My Garden" showSettings={true} onSettingsPress={handleSettingsPress} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.heading}>My Garden</Text>
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
              <Text style={styles.modalText}>Plant Information</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#cae8ca',
  },
  scrollContainer: {
    padding: 20,
    alignItems: 'center',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginBottom: 20,
  },
  plantContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  plantImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  plantName: {
    fontSize: 18,
    color: '#333',
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  fullImage: {
    width: '80%',
    height: '50%',
    resizeMode: 'contain',
  },
  modalText: {
    fontSize: 18,
    color: 'white',
    marginTop: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  closeButton: {
    padding: 10,
    backgroundColor: '#6eba70',
    borderRadius: 5,
    marginRight: 10,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  deleteButton: {
    padding: 10,
    backgroundColor: '#ff4d4d',
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
  },
});