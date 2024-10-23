import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Image, Alert, Dimensions, Platform, ActionSheetIOS, TouchableOpacity, Modal } from 'react-native';
import { useRoute, RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';
import { Button, Provider as PaperProvider, useTheme, MD3Theme } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { insertImage, getImages, createTable } from '@/app/utils/database';
import { identifyPlant } from '@/scripts/Pl@ntNetAPI'; // Import the identifyPlant function
import { makeStyles } from '@/app/res/styles/addPhotoStyles'; // Import the styles
import axios from 'axios';
import { fetchPlantInfoBySpecies } from '@/scripts/perenual';
import { fetchPlantInfoByID } from '@/scripts/perenual2';


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
  const [plantSpecies, setPlantSpecies] = useState<string>('Unknown'); // Plant Species
  const [selectedOrgan, setSelectedOrgan] = useState<string>('leaf'); // Default organ
  const organs = ['Leaf', 'Flower', 'Fruit', 'Bark']; // Organ options
  const [identificationResults, setIdentificationResults] = useState<any[]>([]); // Identification results
  const [isResultModalVisible, setIsResultModalVisible] = useState<boolean>(false); // Result modal visibility
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); // Use navigation hook with proper type
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null); //loading message
  const [isOrganModalVisible, setIsOrganModalVisible] = useState<boolean>(false); // Organ modal visibility
  const [speciesData, setSpeciesData] = useState<any | null>(null); // Species data
  const [showSpeciesData, setShowSpeciesData] = useState<boolean>(false);
  const [loadingSpecies, setLoadingSpecies] = useState<boolean>(false);
  const [isSpeciesModalVisible, setSpeciesModalVisible] = useState<boolean>(false);
  const [shouldFetchSpecies, setShouldFetchSpecies] = useState<boolean>(false);
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
      setIsOrganModalVisible(true); // Show organ selection modal
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
      setIsOrganModalVisible(true); // Show organ selection modal
    }
  };

  // Create the table when the component mounts
  useEffect(() => {
    createTable();
  }, []);

  // Handle Save to Garden button press
  const handleSaveToGarden = async () => {
    if (image && plantName && speciesData) {
      try {
        // Insert the image URI into the database
        await insertImage(plantName, image, plantSpecies,  speciesData.description,
                                                                  speciesData.watering,
                                                                  speciesData.watering_general_benchmark.value,
                                                                  speciesData.watering_general_benchmark.unit,
                                                                  speciesData.poisonousToHumans,
                                                                  speciesData.poisonousToPets,
                                                                  speciesData.scientific_name, // Add scientific name
                                                                  speciesData.family,           // Add family
                                                                  speciesData.sunlight);
        setLoadingMessage('Saving to garden...');

        // Fetch the updated list of images
        getImages((images) => {
          setLoadingMessage(null);
          setImage(null); // Clear the image from the view
          setPlantName(''); // Clear the plant name
          setPlantSpecies('Unknown');
          setSpeciesData(null);// Clear the plant species
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
//joels function from here .........................

  const resetState = () => {
    setImage(null);
    setPlantName('');
    setPlantSpecies('Unknown');
    setSpeciesData(null);
    setIdentificationResults([]);
    setLoadingMessage(null);
    setSelectedOrgan('leaf'); // Reset to default organ if necessary
    setIsOrganModalVisible(false);
    setIsResultModalVisible(false);
    setSpeciesModalVisible(false);
  };

  const handleShowSpeciesData = async () => {
        //if (!showSpeciesData && !speciesData) {
        if (plantSpecies && !showSpeciesData) {
         console.log("Fetching species data for:", plantSpecies);
          // If species data is not loaded and the user is requesting to show it, fetch the data
          //setLoadingMessage('Getting info');

          try {
            // Make the API call here using the selected image species
            const speciesInfo = await fetchPlantInfoBySpecies(plantSpecies);

            if (speciesInfo && speciesInfo.data && speciesInfo.data.length > 0) {
              const speciesId = speciesInfo.data[0].id; // Get the species ID from the first API response
              // Second API call to fetch detailed plant info by species ID
              const detailedSpeciesInfo = await fetchPlantInfoByID(speciesId);
              // Set the detailed species data to state
              setSpeciesData(detailedSpeciesInfo);
              setLoadingMessage(null);

            } else {
              setSpeciesData(null); // No species data found
              //setLoadingMessage('No Species Data found');
            }
          } catch (error) {
            console.error("Error fetching species data:", error);
            Alert.alert('Error', 'Unable to fetch species data. Please try again.');
            setSpeciesData(null);
          } finally {
            setLoadingSpecies(false);

          }
        }else {
     setShowSpeciesData((prev) => !prev);
     //setSpeciesModalVisible(true);
     }
   };




   //to here............................................

  const handleOrganSelect = async (organ: string) => {
    setSelectedOrgan(organ.toLowerCase());
    setIsOrganModalVisible(false);
    await handleIdentifyPlant(); // Identify plant after organ selection
    setIsResultModalVisible(true); // Show result selection modal
  };

const handleResultSelect = async (result: any) => {
  setPlantSpecies(result.species.scientificNameWithoutAuthor);
  setShouldFetchSpecies(true); // Set this to true to indicate fetching is allowed
  setIsResultModalVisible(false);
};

// Modify the effect
useEffect(() => {
  if (shouldFetchSpecies && plantSpecies && plantSpecies !== 'Unknown') {
    handleShowSpeciesData();
    setSpeciesModalVisible(true);
    setShouldFetchSpecies(false); // Reset after fetching

  }
}, [plantSpecies, shouldFetchSpecies]);

  const renderResultSelectionModal = () => (
  <Modal
    visible={isResultModalVisible}
    transparent={true}
    animationType="slide"
    onRequestClose={() => setIsResultModalVisible(false)}
  >
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Select Plant Result</Text>
        {identificationResults.map((result, index) => (
          <TouchableOpacity key={index} onPress={() => handleResultSelect(result)}>
              <View style={styles.resultBox}>
                <Text style={styles.resultInfo}>
                  {result.species.scientificNameWithoutAuthor}
                </Text>
                <Text style={styles.resultInfo}>
                  ({result.species.commonNames[0] || 'No common name'})
                </Text>
                <Text style={styles.resultInfo}>
                  Confidence: {(result.score * 100).toFixed(2) + '%'}
                </Text>
                <View style={styles.imageRow}>
                {result.images.slice(0, 3).map((image: any, imgIndex: number) => (
                  <Image key={imgIndex} source={{ uri: image.url.s }} style={styles.resultImage} />
                ))}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  </Modal>
  );

  const handleIdentifyPlant = async () => {
  if (image) {
    setLoadingMessage('Identifying plant...');
    try {
      const results = await identifyPlant(image, selectedOrgan.toLowerCase());
      setIdentificationResults(results.results.slice(0, 4));
      setLoadingMessage(null);
    } catch (error) {
      setLoadingMessage('Failed to identify plant');
    }
  }};

  const renderOrganSelectionModal = () => (
  <Modal
    visible={isOrganModalVisible}
    transparent={true}
    animationType="slide"
    onRequestClose={() => setIsOrganModalVisible(false)}
  >
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Select Plant Organ</Text>
        {organs.map((organ) => (
          <TouchableOpacity key={organ} onPress={() => handleOrganSelect(organ)}>
            <Text style={styles.modalOption}>{organ}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  </Modal>
  );

const renderSpeciesInfoModal = () => (
  <Modal
    visible={isSpeciesModalVisible}
    transparent={false} // Make the modal full screen
    animationType="slide"
    onRequestClose={() => setSpeciesModalVisible(false)}
  >
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      {/* Add a button to close the modal */}
      <Button
        onPress={() => setSpeciesModalVisible(false)}
        style={{ alignSelf: 'flex-end', margin: 10 }}
      >
        Close
      </Button>

      {/* Display species information */}
      {speciesData ? (
        <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Image
            source={{ uri: speciesData.default_image.thumbnail }} // Replace 'imageUrl' with your actual image URL field
            style={{ width: '100%', height: 200, resizeMode: 'cover', marginBottom: 10 }} // Adjust the styles as needed
                  />
          <Text style={styles.speciesDataTitle}>Species Information:</Text>
         <Text style={styles.modalText}>Description: {speciesData.description}</Text>
         <Text style={styles.modalText}>Watering: {speciesData.watering}</Text>
         <Text style={styles.modalText}>Water every: {speciesData.watering_general_benchmark.value} {speciesData.watering_general_benchmark.unit}</Text>
         <Text style={styles.modalText}>Poisonous to Humans: {speciesData.poisonousToHumans ? 'Yes' : 'No'}</Text>
         <Text style={styles.modalText}>Poisonous to Pets: {speciesData.poisonousToPets ? 'Yes' : 'No'}</Text>
         <Text style={styles.modalText}>Species: {speciesData.common_name}</Text>
         <Text style={styles.modalText}>Scientific Name: {speciesData.scientific_name}</Text>
         <Text style={styles.modalText}>Family: {speciesData.family}</Text>
         <Text style={styles.modalText}>Can you eat it?: {speciesData.edible_leaf? 'Yes' : 'No'}</Text>
         <Text style={styles.modalText}>Sunlight: {speciesData.sunlight}</Text>

        </ScrollView>
      ) : (
        <Text>Loading species data...</Text>
      )}
    </View>
  </Modal>
);

/*Screen UI
StyleSheet is in app/res/styles/addPhotoStyles */

  return (

    <PaperProvider>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>

        <View style={styles.container}>
          {/* Image, Title, and Information Display */}
          <View style={[styles.imageContainer, { height: imageHeight }]}>
            {image ? (
              <Image source={{ uri: image }} style={styles.previewImage} />
            ) : (
              <Text style={styles.noImageText}>No image selected yet</Text>
            )}
          </View>
            
          {/* Plant text and information */}
               <View style={styles.textContainer}>
                 <TextInput
                   style={styles.mainText}
                   placeholder="Enter plant name"
                   value={plantName}
                   onChangeText={setPlantName}
                 />

                 {/* Row layout for species name and button */}
                 <View style={styles.speciesRow}>
                   <Text style={styles.secondaryText}>{plantSpecies}</Text>


                 </View>
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
      </ScrollView>
        <Button
        mode="outlined"
        onPress={resetState}
        style={styles.resetButton}>
              Try Again!
            </Button>

      {renderOrganSelectionModal()}
      {renderResultSelectionModal()}
      {renderSpeciesInfoModal()}


    </PaperProvider>
  );
}