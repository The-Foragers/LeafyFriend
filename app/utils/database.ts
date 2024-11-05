import * as SQLite from 'expo-sqlite';

const dbPromise = SQLite.openDatabaseAsync('garden.db');

// Initialize the database
export const createTable = async () => {
  const db = await dbPromise;
  // Drop the old table if it exists
  //await db.execAsync('DROP TABLE IF EXISTS images;');

  // Create the new table with the updated schema
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      uri TEXT,
      species TEXT,
      description TEXT,
      watering TEXT,
      poisonousToHumans TEXT,   -- Updated to TEXT for string values
      poisonousToPets TEXT,     -- Updated to TEXT for string values
      scientificName TEXT,
      family TEXT,
      sunlight TEXT,
      additionalCareTips TEXT   -- Added additionalCareTips field
    );
  `);
};

// Insert an image into the database
export const insertImage = async (
  name: string,
  uri: string,
  species: string,
  description: string,
  watering: string,
  poisonousToHumans: string,  // Updated type to string
  poisonousToPets: string,    // Updated type to string
  scientificName: string,
  family: string,
  sunlight: string,
  additionalCareTips: string  // Added additionalCareTips parameter
) => {
  const db = await dbPromise;
  await db.runAsync(`INSERT INTO images (name, uri, species, description, watering, poisonousToHumans, poisonousToPets, scientificName, family, sunlight, additionalCareTips)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [name, uri, species, description, watering, poisonousToHumans, poisonousToPets, scientificName, family, sunlight, additionalCareTips]
  );
};

// Get all images from the database
export const getImages = async (callback: (images: {
  id: number, // Include id in the type definition
  name: string,
  uri: string,
  species: string,
  description: string,
  watering: string,
  poisonousToHumans: string,
  poisonousToPets: string,
  scientificName: string,
  family: string,
  sunlight: string,
  additionalCareTips: string
}[]) => void) => {
  const db = await dbPromise;
  const rows = await db.getAllAsync('SELECT * FROM images;');
  const images = rows.map(row => ({
    id: row.id, // Include id in the mapped data
    name: row.name,
    uri: row.uri,
    species: row.species,
    description: row.description,
    watering: row.watering,
    poisonousToHumans: row.poisonousToHumans,
    poisonousToPets: row.poisonousToPets,
    scientificName: row.scientificName,
    family: row.family,
    sunlight: row.sunlight,
    additionalCareTips: row.additionalCareTips
  }));
  callback(images);
};

// Update a plant's name in the database
export const updatePlantName = async (id: number, newName: string) => {
  const db = await dbPromise;
  try {
    await db.runAsync('UPDATE images SET name = ? WHERE id = ?;', [newName, id]);
    console.log(`Successfully updated plant with ID ${id} to new name: ${newName}`);
    return true; // Return true if the update was successful
  } catch (error) {
    console.error("Failed to update plant name:", error);
    return false; // Return false if there was an error
  }
};
//update the plant picture
export const updatePlantImage = async (id: number, newUri: string) => {
  const db = await dbPromise;
  try {
    await db.runAsync('UPDATE images SET uri = ? WHERE id = ?;', [newUri, id]);
    console.log(`Successfully updated plant with ID ${id} to new image URI: ${newUri}`);
    return true;
  } catch (error) {
    console.error("Failed to update plant image:", error);
    return false;
  }
};


// Delete an image from the database
// Delete an image from the database
export const deleteImage = async (id: number) => {
  const db = await dbPromise;
  await db.runAsync('DELETE FROM images WHERE id = ?;', [id]);
};


// Check the table schema
export const checkTableSchema = async () => {
  const db = await dbPromise;
  const result = await db.getAllAsync('PRAGMA table_info(images);');
  console.log(result);
};

// Call createTable to ensure the table is created
createTable();
