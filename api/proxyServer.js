import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import csvParser from 'csv-parser';
import compression from 'compression';

dotenv.config();

const app = express();
let zipData = {}; // To store preprocessed data

// Enable JSON and URL-encoded parsing with appropriate size limits
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Enable CORS for the frontend
app.use(cors({ origin: 'https://weave-sense.vercel.app', credentials: true }));

// Enable compression
// eslint-disable-next-line no-unused-vars
app.use(compression({ filter: (_req, _res) => true }));

// Preprocess CSV data on server startup
const preprocessData = () => {
  fs.createReadStream('data/realtor-data.zip.csv')
    .pipe(csvParser({ headers: ['status', 'bed', 'bath', 'acre_lot', 'city', 'state', 'zip_code', 'house_size', 'prev_sold_date', 'price'] }))
    .on('data', (row) => {
      const zipCode = row.zip_code?.trim();
      const zipPrefix = zipCode ? zipCode.slice(0, 3) : null;
      if (!zipCode) return;
      if (!zipData[zipCode]) zipData[zipCode] = [];
      zipData[zipCode].push({
        price: parseFloat(row.price) || null,
        bedrooms: parseInt(row.bed, 10) || null,
        bathrooms: parseInt(row.bath, 10) || null,
        zip_code: zipCode,
        zip_prefix: zipPrefix,
        city: row.city,
        state: row.state?.trim(),
        house_size: parseInt(row.house_size, 10) || null,
      });
    })
    .on('end', () => {
      console.log('CSV file successfully processed.');
    })
    .on('error', (err) => console.error('Error processing CSV:', err.message));
};

preprocessData();

// Updated `/all-zip-data` Endpoint
app.get('/api/all-zip-data', (req, res) => {
  const { zip_code, zip_prefix, state, page = 1, limit = 10 } = req.query;
  let results = Object.values(zipData).flat();

  if (zip_code) results = results.filter(item => item.zip_code === zip_code.trim());
  if (zip_prefix) results = results.filter(item => item.zip_prefix === zip_prefix.trim());
  if (state) results = results.filter(item => item.state?.toLowerCase() === state.trim().toLowerCase());

  if (results.length === 0) return res.status(404).json({ error: 'No data found for the specified criteria' });

  const startIndex = (page - 1) * limit;
  const paginatedResults = results.slice(startIndex, startIndex + limit);
  res.json(paginatedResults);
});

export default app;
