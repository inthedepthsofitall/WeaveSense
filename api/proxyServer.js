/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import compression from 'compression';

dotenv.config();

const app = express();
const WEAVIATE_URL = process.env.WEAVIATE_URL;  // Weaviate URL for backend
const WEAVIATE_API_KEY = process.env.WEAVIATE_API_KEY;  // Weaviate API Key for backend

// Enable JSON and URL-encoded parsing with appropriate size limits
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Enable CORS for the frontend
app.use(cors({ origin: 'https://weave-sense.vercel.app', credentials: true }));

// Enable compression
app.use(compression({ filter: (_req, _res) => true }));

// Fetch data from Weaviate and pass to frontend
app.get('/api/all-zip-data', async (req, res) => {
  const { zip_code } = req.query; // Query parameter from the frontend
  
  try {
    // Make a request to Weaviate using Axios
    const response = await axios.get(`${WEAVIATE_URL}/v1/objects`, {
      headers: {
        'Authorization': `Bearer ${WEAVIATE_API_KEY}`,  // Auth with Weaviate API Key
      },
      params: {
        zip_code: zip_code,  // Pass the zip code query parameter to Weaviate
      },
    });

    // Send the data back to the frontend
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data from Weaviate:', error.message);
    res.status(500).json({ error: 'Failed to fetch data from Weaviate' });
  }
});

export default app;

