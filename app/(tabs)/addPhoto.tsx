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
  const organs = ['leaf', 'flower', 'fruit', 'bark'];// Organ options
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
  const [commonName, setCommonName] = useState<string>(''); // Common Name
  const [plantImages, setPlantImages] = useState<string[]>([]); // Plant Images
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0); // Current image index
  const [highestConfidence, setHighestConfidence] = useState<number | null>(null); // Highest confidence result
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
    if (image && plantName ) {
      try {
              const description = speciesData?.description || 'Unknown';
              const watering = speciesData?.watering || 'Unknown';
              const wateringValue = speciesData?.watering_general_benchmark?.value || 'Unknown';
              const wateringUnit = speciesData?.watering_general_benchmark?.unit || 'Unknown';
              const poisonousToHumans = speciesData?.poisonousToHumans || false; // Assuming false is the default
              const poisonousToPets = speciesData?.poisonousToPets || false; // Assuming false is the default
              const scientificName = speciesData?.scientific_name || 'Unknown';
              const family = speciesData?.family || 'Unknown';
              const sunlight = speciesData?.sunlight || 'Unknown';
        // Insert the image URI into the database
        await insertImage(
          plantName,
          image,
          plantSpecies || 'Unknown',
          description,
          watering,
          wateringValue,
          wateringUnit,
          poisonousToHumans,
          poisonousToPets,
          scientificName,
          family,
          sunlight
        );
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

  /*const handleResultSelect = async (result: any) => {
    setPlantSpecies(result.species.scientificNameWithoutAuthor);
    setShouldFetchSpecies(true); // Set this to true to indicate fetching is allowed
    setIsResultModalVisible(false);
  };*/

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
          <TouchableOpacity key={index} onPress={() => handleOrganSelect(result)}>
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
        if (results.results.length > 0) {
          // Get the result with the highest confidence score
          const highestConfidenceResult = results.results.reduce((prev: { score: number; }, current: { score: number; }) =>
            (prev.score > current.score) ? prev : current
          );
          // Set the plant species, common name, and plant image to the highest confidence result
          setPlantSpecies(highestConfidenceResult.species.scientificNameWithoutAuthor);
          setCommonName(highestConfidenceResult.species.commonNames[0] || 'No common name');
          setPlantImages(highestConfidenceResult.images.map((img: { url: { s: any; }; }) => img.url.s));
          setHighestConfidence(parseFloat((highestConfidenceResult.score * 100).toFixed(2))); // Set highest confidence score
          setCurrentImageIndex(0); // Reset to the first image

          setShouldFetchSpecies(true);
        } else {
          setPlantSpecies('Unknown');
          setCommonName('');
          setPlantImages([]);
        }
        setLoadingMessage(null);
      } catch (error) {
        setLoadingMessage('Failed to identify plant');
      }
    }
  };

  /*Modal for organ selection and plant image routes */
  const handleNextImage = () => {
    if (plantImages.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % plantImages.length);
    }
  };

  const handlePrevImage = () => {
    if (plantImages.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + plantImages.length) % plantImages.length);
    }
  };

  const getImageForOrgan = (organ) => {
    switch (organ) {
      case 'leaf':
        return require('../../assets/images/leaf.png'); // Adjusted path
      case 'flower':
        return require('../../assets/images/flower.png');
      case 'fruit':
        return require('../../assets/images/fruit.png');
      case 'bark':
        return require('../../assets/images/bark.png');
      default:
        console.log("No image found for", organ);
        return null;
    }
  };
  
  
  

  const renderOrganSelectionModal = () => (
    <Modal
      visible={isOrganModalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setIsOrganModalVisible(false)}
    >
      <View style={styles.organModalContainer}>
        <View style={styles.organModalContent}>
          <Text style={styles.organModalTitle}>Select Plant Organ</Text>
          <View style={styles.organModalGridContainer}>
            {organs.map((organ) => (
              <TouchableOpacity
                key={organ}
                style={styles.organModalGridItem}
                onPress={() => handleOrganSelect(organ)}
              >
                <Image
                  source={getImageForOrgan(organ)}
                  style={styles.organModalImage}
                />
                <Text style={styles.organModalOption}>{organ}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
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
                {/* Plant Results Information */}
                         {plantSpecies !== 'Unknown' && (
                           <View style={styles.plantInfoContainer}>
                             <Text style={styles.plantInfoText}>Scientific Name: {plantSpecies}</Text>
                             <Text style={styles.plantInfoText}>Common Name: {commonName}</Text>
                             <Text style={styles.plantInfoText}>Confidence: {(highestConfidence)}%</Text>
                             {plantImages.length > 0 && (
                               <View style={styles.imageNavigationContainer}>
                                 <TouchableOpacity onPress={handlePrevImage} style={styles.arrowButton}>
                                   <Text style={styles.arrowText}>{"<"}</Text>
                                 </TouchableOpacity>
                                 <Image source={{ uri: plantImages[currentImageIndex] }} style={styles.plantImage} />
                                 <TouchableOpacity onPress={handleNextImage} style={styles.arrowButton}>
                                   <Text style={styles.arrowText}>{">"}</Text>
                                 </TouchableOpacity>
                               </View>
                             )}
                           </View>
                         )}
                         {plantSpecies !== 'Unknown' && (
                           <View style={styles.buttonContainer}>
                             <Button
                               mode="contained-tonal"
                               onPress={() => handleAddPhotoPress()}
                               style={styles.resetButton}
                             >
                               Doesn't look the same? Try another angle
                             </Button>
                           </View>
                         )}


               {speciesData ? (
                 <View style={styles.speciesInfoContainer}>
                   <Text style={styles.speciesDataTitle}>Species Information:</Text>
                   <View style={styles.container}>
                     <Text style={styles.modalText}>
                       Description: {speciesData?.description || 'Unknown'}
                     </Text>
                     <Text style={styles.modalText}>
                       Watering: {speciesData.watering || 'Unknown'}
                     </Text>
                     <Text style={styles.modalText}>
                       Water every: {speciesData.watering_general_benchmark?.value || 'Unknown'}{' '}
                       {speciesData.watering_general_benchmark?.unit || 'Unknown'}
                     </Text>
                     <Text style={styles.modalText}>
                       Poisonous to Humans: {speciesData.poisonousToHumans ? 'Yes' : 'No'}
                     </Text>
                     <Text style={styles.modalText}>
                       Poisonous to Pets: {speciesData.poisonousToPets ? 'Yes' : 'No'}
                     </Text>
                     <Text style={styles.modalText}>
                       Scientific Name: {speciesData.scientific_name || 'Unknown'}
                     </Text>
                     <Text style={styles.modalText}>
                       Family: {speciesData.family || 'Unknown'}
                     </Text>
                     <Text style={styles.modalText}>
                       Sunlight: {speciesData.sunlight || 'Unknown'}
                     </Text>
                   </View>
                 </View>
               ) : (
               <View style={styles.speciesInfoContainer}>
                <Text style={styles.speciesDataTitle}>Species Information:</Text>
                 <Text style={styles.modalText}>No information available.</Text>
                </View>
               )}

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
      {/*}{renderResultSelectionModal()}*/}



    </PaperProvider>
  );
}