/* eslint-disable no-undef */
import fetch from 'node-fetch';
import fs from 'fs';
import csvParser from 'csv-parser';
import dotenv from 'dotenv';

dotenv.config();


const WEAVIATE_URL = process.env.VITE_WEAVIATE_URL;
const WEAVIATE_API_KEY = process.env.VITE_WEAVIATE_API_KEY;

const uploadDataToWeaviate = async () => {
  const data = [];
  const filePath = './data/realtor-data.zip.csv'; // Ensure this path matches your folder structure

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (row) => {
      data.push({
        zip_code: row.zip_code?.trim(), // Remove leading/trailing spaces
        price: parseFloat(row.price) || null,
        bedrooms: parseInt(row.bedrooms) || null,
        // Add other columns as needed
      });
    })
    .on('end', async () => {
      console.log(`Read ${data.length} rows from CSV. Starting upload...`);

      for (const item of data) {
        try {
          const response = await fetch(`${WEAVIATE_URL}/v1/objects`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${WEAVIATE_API_KEY}`,
            },
            body: JSON.stringify({
              class: 'RealEstate',
              properties: item,
            }),
          });

          if (!response.ok) {
            console.error(`Failed to upload item: ${JSON.stringify(item)}`);
          }
        } catch (error) {
          console.error(`Error uploading item: ${error.message}`);
        }
      }

      console.log('Data upload complete.');
    })
    .on('error', (error) => {
      console.error('Error reading CSV file:', error.message);
    });
};

uploadDataToWeaviate();
