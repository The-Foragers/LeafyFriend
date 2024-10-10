import * as SQLite from 'expo-sqlite';

const dbPromise = SQLite.openDatabaseAsync('garden.db');

// Initialize the database
export const createTable = async () => {
  const db = await dbPromise;
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      uri TEXT
      species TEXT
    );
  `);
};

// Insert an image into the database
export const insertImage = async (name: string, uri: string, species: string) => {
  const db = await dbPromise;
  await db.runAsync('INSERT INTO images (name, uri, species) VALUES (?, ?, ?);', [name, uri, species]);
};

// Get all images from the database
export const getImages = async (callback: (images: { name: string, uri: string, species: string }[]) => void) => {
  const db = await dbPromise;
  const rows: { name: string, uri: string, species: string }[] = await db.getAllAsync('SELECT * FROM images;');
  const images = rows.map(row => ({ name: row.name, uri: row.uri, species: row.species }));
  callback(images);
};

// Delete an image from the database
export const deleteImage = async (uri: string) => {
  const db = await dbPromise;
  await db.runAsync('DELETE FROM images WHERE uri = ?;', [uri]);
};