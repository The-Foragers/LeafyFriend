// plantApi.js
import fetch from 'node-fetch';
import axios from 'axios';

type Message = {
  role: string;
  content: string;
};

export type PlantInfo = {
  description: string;
  watering: string;
  sunlight: string;
  poisonousToHumans: string;
  poisonousToPets: string;
  scientificName: string;
  family: string;
  additionalCareTips: string;
};

export async function fetchPlantInfo(plantSpecies: string): Promise<PlantInfo | null> {
  const url = 'https://api.hyperbolic.xyz/v1/chat/completions';
  const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqb2VsLmVmcmVuQGdtYWlsLmNvbSIsImlhdCI6MTczMDMyNzM3OH0.AVufIZJUcziSHJ36yTbcX1lwd5_7xVPXvYVy5rzs6Nk'; // Consider storing this securely or in an environment variable

  const prompt = `You are an expert botanist and plant care advisor. Provide a detailed care and information guide for the plant species: **${plantSpecies}**.

Please return the response as a JSON object with the following keys:
1. "description": A brief overview of the plant, including its common appearance and any unique characteristics.
2. "watering": Recommended watering frequency and quantity, including any seasonal adjustments.
3. "sunlight": Ideal lighting conditions (e.g., direct sunlight, partial shade).
4. "poisonousToHumans": Is this plant toxic to humans? Provide details if it is.
5. "poisonousToPets": Is this plant toxic to pets? Provide details if it is.
6. "scientificName": The scientific name of the plant.
7. "family": The family this plant belongs to.
8. "additionalCareTips": Any extra tips for maintaining the plant's health, such as soil type, humidity, temperature, or common issues.

Return only the JSON object and no additional text.`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'meta-llama/Llama-3.2-3B-Instruct',
      messages: [{ role: 'user', content: prompt } ],
      max_tokens: 512,
      temperature: 0.7,
      top_p: 0.9,
      stream: false,
    }),
  });

  if (!response.ok) {
    console.error('Error fetching data:', response.status, response.statusText);
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const json = await response.json();
  let output = json.choices[0]?.message?.content;  // Changed 'const' to 'let'
  output = output.replace(/```json|```/g, '');
  
  // Log the output to understand what was received
  console.log('Raw LLM response:', output);

  try {
    // Try parsing the output as JSON
    const plantInfo: PlantInfo = JSON.parse(output);
    return plantInfo;
  } catch (error) {
    console.error('Error parsing JSON response:', error);
    console.error('Output was:', output); // Log the actual response for debugging
    return null; // Return null if parsing fails
  }
}
