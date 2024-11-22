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
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// Enable compression
app.use(
  compression({
    filter: (_req, _res) => true, // Apply compression for all responses
  })
);

// Middleware for query parameter validation
app.use((req, res, next) => {
  const { zip_code, page, limit } = req.query;

  if (zip_code && typeof zip_code !== 'string') {
    return res.status(400).json({ error: 'Invalid ZIP code parameter' });
  }
  if (page && (!Number.isInteger(+page) || +page <= 0)) {
    return res.status(400).json({ error: 'Invalid page parameter' });
  }
  if (limit && (!Number.isInteger(+limit) || +limit <= 0)) {
    return res.status(400).json({ error: 'Invalid limit parameter' });
  }

  next();
});

// Preprocess CSV data on server startup
const preprocessData = () => {
    fs.createReadStream('data/realtor-data.zip.csv')
    .pipe(csvParser({ headers: ['status', 'bed', 'bath', 'acre_lot', 'city', 'state', 'zip_code', 'house_size', 'prev_sold_date', 'price'] }))
    .on('data', (row) => {
      const zipCode = row.zip_code?.trim();
      const zipPrefix = zipCode ? zipCode.slice(0, 3) : null;
  
      if (!zipCode) {
        console.log('Skipping row without ZIP code:', row);
        return;
      }
  
      if (!zipData[zipCode]) {
        zipData[zipCode] = [];
      }
  
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
      console.log('CSV file successfully processed and preloaded.');
  
      // Log unique states
      const uniqueStates = new Set();
      Object.values(zipData).flat().forEach((item) => {
        if (item.state) uniqueStates.add(item.state);
      });
      console.log('Unique States:', Array.from(uniqueStates));
  
      console.log('Does 10504 exist in zipData?', zipData['10504'] ? 'Yes' : 'No');
    })
    .on('error', (err) => {
      console.error('Error processing CSV:', err.message);
    });
  
};

preprocessData(); // Run preprocessing when the server starts

// Updated `/all-zip-data` Endpoint
app.get('/all-zip-data', (req, res) => {
  const { zip_code, zip_prefix, state, page = 1, limit = 10 } = req.query;

  console.log('Received query params:', { zip_code, zip_prefix, state, page, limit });

  let results = Object.values(zipData).flat(); // Flatten the data to process all ZIP codes
  console.log('Initial data length:', results.length);

  // Filter by ZIP code if specified
  if (zip_code) {
    console.log('Filtering for zip_code:', zip_code);
    results = results.filter(item => item.zip_code === zip_code.trim());
    console.log(`After zip_code filter: ${results.length} results found`);
  }

  // Filter by ZIP prefix if specified
  if (zip_prefix) {
    console.log('Filtering for zip_prefix:', zip_prefix);
    results = results.filter(item => item.zip_prefix === zip_prefix.trim());
    console.log(`After zip_prefix filter: ${results.length} results found`);
  }

  // Filter by state if specified
  if (state) {
    console.log('Filtering for state:', state);
    results = results.filter(item => item.state?.toLowerCase() === state.trim().toLowerCase());
    console.log(`After state filter: ${results.length} results found`);
  }

  // Handle empty results
  if (results.length === 0) {
    console.log('No matching data found for the query.');
    return res.status(404).json({ error: 'No data found for the specified criteria' });
  }

  // Apply pagination
  const startIndex = (page - 1) * limit;
  const paginatedResults = results.slice(startIndex, startIndex + limit);

  console.log(`Returning ${paginatedResults.length} results for page ${page} with limit ${limit}`);
  res.json(paginatedResults);
});

// Root Route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the WeaveSense Proxy Server!',
    availableRoutes: [
      '/all-zip-data?zip_code=<zip_code>&page=<page>&limit=<limit>',
      '/all-zip-data?zip_code=<zip_code>&summary=true',
    ],
  });
});

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});





