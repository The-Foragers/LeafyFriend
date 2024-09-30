import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

export default function AddPhotoScreen() {
  const [image, setImage] = useState<string | null>(null);

  const openCamera = async () => {
    // Ask for camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to make this work!');
      return;
    }

    // Launch the camera
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.Heading}>Camera App</Text>
      <Text style={styles.SubHeading}>Add a New Photo</Text>

      <View style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.previewImage} />
        ) : (
          <Text style={styles.noImageText}>No image taken yet</Text>
        )}
      </View>

      <TouchableOpacity style={styles.openCameraButton} onPress={openCamera}>
        <Text style={styles.openCameraButtonText}>Open Camera</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 10,
  },
  SubHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'gray',
    marginBottom: 20,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  noImageText: {
    fontSize: 16,
    color: 'gray',
  },
  openCameraButton: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 10,
  },
  openCameraButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
