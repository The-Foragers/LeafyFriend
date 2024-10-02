import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  Platform,
  Dimensions,
  ActionSheetIOS,
  InteractionManager,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Button, Provider as PaperProvider } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';

// Define the type for the route parameters
type RootStackParamList = {
  addPhoto: {
    autoOpen?: boolean;
  };
  garden: undefined;
  badges: undefined;
};

type AddPhotoScreenRouteProp = RouteProp<RootStackParamList, 'addPhoto'>;
const { width: screenWidth } = Dimensions.get('window');

export default function AddPhotoScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [imageHeight, setImageHeight] = useState<number>(screenWidth / 2); // Default height
  const route = useRoute<AddPhotoScreenRouteProp>(); // Use the type with the route
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); // Use navigation hook with proper type

  // Automatically trigger add photo dialog if navigated with param `autoOpen`
  useEffect(() => {
    if (route.params?.autoOpen) {
      InteractionManager.runAfterInteractions(() => {
        setTimeout(() => {
          handleAddPhotoPress();
        }, 100); // Small delay to ensure everything has settled
      });
    }
  }, [route.params]);

  // Handle opening camera or gallery specific to platform
  //ios first
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
    } 
    // Android and other platforms
    else {
      Alert.alert(
        'Choose an option',
        '',
        [
          {
            text: 'Take a Photo',
            onPress: () => openCamera(),
          },
          {
            text: 'Open Gallery',
            onPress: () => openGallery(),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
        { cancelable: true }
      );
    }
  };

  // Open Camera
  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to make this work!');
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
      setImage(uri);
      Image.getSize(uri, (width, height) => {
        const aspectRatio = height / width;
        setImageHeight(screenWidth * aspectRatio);
      });
    }
  };

  // Open Gallery
  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need gallery permissions to make this work!');
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
      setImage(uri);
      Image.getSize(uri, (width, height) => {
        const aspectRatio = height / width;
        setImageHeight(screenWidth * aspectRatio);
      });
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        {/* Image, Title, and Information Display */}
        <View style={[styles.imageContainer, { height: imageHeight }]}>
          {image ? (
            <Image source={{ uri: image }} style={styles.previewImage} />
          ) : (
            <Text style={styles.noImageText}>No image selected yet</Text>
          )}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.mainText}>Name of plant</Text>
          <Text style={styles.secondaryText}>information</Text>
        </View>

        {/* Save to Garden Button */}
        <Button
          mode="contained-tonal"
          onPress={() => alert('Saving to garden...')}
          style={styles.saveGardenButton}
        >
          Save to Garden
        </Button>

        {/* Add Photo Button */}
        <Button
          mode="contained-tonal"
          onPress={handleAddPhotoPress}
          style={styles.addPhotoButton}
        >
          Scan Plant
        </Button>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 100,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#cae8ca',
  },
  imageContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 0,
    borderColor: '#ccc',
    borderRadius: 0,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  noImageText: {
    fontSize: 16,
    color: 'gray',
  },
  textContainer: {
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 20,
  },

  //Plant text and information
  mainText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#13250e'
  },
  secondaryText: {
    fontSize: 16,
    color: '#4c8435',
  },

  //button styles
  saveGardenButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#6eba70',
    paddingHorizontal: 0,
    flex:1,
  },
  addPhotoButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#6eba70', 
    paddingHorizontal: 0,
    flex: 1,
  },
});