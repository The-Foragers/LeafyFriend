import axios from 'axios';

const PLANTNET_API_URL = 'https://my-api.plantnet.org/v2/identify/all';
const API_KEY = '2b10l8GSWiFjtxb9826Ux0d4u';

export const identifyPlant = async (imageUri, organ) => {
  const formData = new FormData();
  formData.append('images', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'plant.jpg',
  });
  formData.append('organs', organ); 

  try {
    const response = await axios.post(`${PLANTNET_API_URL}?api-key=${API_KEY}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error identifying plant:', error);
    throw error;
  }
};