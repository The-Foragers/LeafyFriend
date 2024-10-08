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
  TextInput,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Button, Provider as PaperProvider, useTheme, MD3Theme } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp, NavigationProp, Theme as NavigationTheme } from '@react-navigation/native';
import { createTable, insertImage, getImages } from '@/app/utils/database';
import { makeStyles } from '@/app/res/styles/addPhotoStyles'; // Import the styles

// Define the type for the route parameters
type RootStackParamList = {
  addPhoto: {
    autoOpen?: boolean;
  index: {
    images: { name: string; uri: string }[];
  };
};
  garden: undefined;
  badges: undefined;
index: {
  images: { name: string; uri: string }[];
};
};

type AddPhotoScreenRouteProp = RouteProp<RootStackParamList, 'addPhoto'>;
const { width: screenWidth } = Dimensions.get('window');

export default function AddPhotoScreen() {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const [image, setImage] = useState<string | null>(null);
  const [imageHeight, setImageHeight] = useState<number>(screenWidth / 2); // Default height
  const route = useRoute<AddPhotoScreenRouteProp>(); // Use the type with the route
  const [plantName, setPlantName] = useState<string>(''); // Plant Name
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); // Use navigation hook with proper type
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null); //loading message

  //This is the code that makes the option menu open each time the screen is opened

/*   useEffect(() => {
    if (route.params?.autoOpen) {
      InteractionManager.runAfterInteractions(() => {
        setTimeout(() => {
          handleAddPhotoPress();
        }, 100); // Small delay to ensure everything has settled
      });
    }
  }, [route.params]); */



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

// Create the table when the component mounts
useEffect(() => {
  createTable();
}, []);

// Handle Save to Garden button press
  const handleSaveToGarden = async () => {
    if (image && plantName) {
      try {
        // Insert the image URI into the database
        await insertImage(plantName, image);
        setLoadingMessage('Saving to garden...');

        // Fetch the updated list of images
        getImages((images) => {
          setLoadingMessage(null);
          setImage(null); // Clear the image from the view
          setPlantName(''); // Clear the plant name
          navigation.navigate('index', { images }); // Pass the updated images to the garden screen
        });
      } catch (error) {
        console.error('Error saving to garden:', error);
        alert('An error occurred while saving to garden');
      }
    } else {
      alert('Please select an image and enter a plant name.');
    }
  };


/*Screen UI
StyleSheet is in app/res/styles/addPhotoStyles */

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
          <TextInput
            style={styles.mainText}
            placeholder="Enter plant name"
            value={plantName}
            onChangeText={setPlantName}
          />
          <Text style={styles.secondaryText}>information</Text>
        </View>

        {/* Save to Garden Button */}
        <Button
          mode="contained-tonal"
          onPress={handleSaveToGarden}
          disabled={!image} // Disable button if no image is loaded
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

        {/* Loading Message */}
        {loadingMessage && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>{loadingMessage}</Text>
          </View>
        )}

      </View>
    </PaperProvider>
  );
}