


// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import fetch from 'node-fetch';

// dotenv.config();

// const app = express();

// // Enable CORS for frontend at localhost:5173 (or your frontend URL)
// app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// // Add a handler for the root path
// app.get('/', (req, res) => {
//   res.json({
//     message: 'Welcome to the WeaveSense Proxy Server!',
//     availableRoutes: ['/env', '/test-direct-fetch?zip_code=<zip_code>', '/api/graphql'],
//   });
// });

// // Add the /env route
// app.get('/env', (req, res) => {
//   res.json({
//     VITE_WEAVIATE_URL: process.env.VITE_WEAVIATE_URL,
//     VITE_WEAVIATE_API_KEY: process.env.VITE_WEAVIATE_API_KEY,
//   });
// });


// // Add a handler for test-direct-fetch
// app.get('/test-direct-fetch', async (req, res) => {
//     const { zip_code } = req.query;
  
//     if (!zip_code) {
//       return res.status(400).json({ error: 'Zip code is required' });
//     }
  
//     try {
//       const response = await fetch(`${process.env.VITE_WEAVIATE_URL}/v1/graphql`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${process.env.VITE_WEAVIATE_API_KEY}`,
//         },
//         body: JSON.stringify({
//           query: `{
//             Get {
//               RealEstate(where: {path: ["zip_code"], operator: Equal, valueString: "${zip_code}"}) {
//                 price
//                 zip_code
//                 bedrooms
//               }
//             }
//           }`,
//         }),
//       });
  
//       const rawResponse = await response.text(); // Log raw response
//       console.log('Weaviate Response:', rawResponse);
  
//       if (!response.ok || !response.headers.get('content-type').includes('application/json')) {
//         throw new Error(`Invalid response: ${rawResponse}`);
//       }
  
//       const data = JSON.parse(rawResponse); // Parse manually to ensure JSON
//       res.setHeader('Content-Type', 'application/json'); // Explicitly set content type
//       res.json(data);
//     } catch (error) {
//       console.error('Direct fetch failed:', error);
//       res.status(500).json({ error: error.message });
//     }
//   });
  
  

  
  
  

// const PORT = 3001;

// app.listen(PORT, () => {
//   console.log(`Proxy server running on http://localhost:${PORT}`);
// });


// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import fetch from 'node-fetch';

// dotenv.config();

// const app = express();

// // Enable CORS for frontend at localhost:5173 (or your frontend URL)
// app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// // Add a handler for the root path
// app.get('/', (req, res) => {
//   res.json({
//     message: 'Welcome to the WeaveSense Proxy Server!',
//     availableRoutes: [
//       '/env',
//       '/test-direct-fetch?zip_code=<zip_code>',
//       '/all-zip-data',
//       '/api/graphql',
//     ],
//   });
// });

// // Add the /env route
// app.get('/env', (req, res) => {
//   res.json({
//     VITE_WEAVIATE_URL: process.env.VITE_WEAVIATE_URL,
//     VITE_WEAVIATE_API_KEY: process.env.VITE_WEAVIATE_API_KEY,
//   });
// });

// // Add a handler for test-direct-fetch
// app.get('/test-direct-fetch', async (req, res) => {
//   const { zip_code } = req.query;

//   if (!zip_code) {
//     return res.status(400).json({ error: 'Zip code is required' });
//   }

//   try {
//     const response = await fetch(`${process.env.VITE_WEAVIATE_URL}/v1/graphql`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${process.env.VITE_WEAVIATE_API_KEY}`,
//       },
//       body: JSON.stringify({
//         query: `{
//           Get {
//             RealEstate(where: {path: ["zip_code"], operator: Equal, valueString: "${zip_code.trim()}"}) {
//               price
//               zip_code
//               bedrooms
//             }
//           }
//         }`,
//       }),
//     });

//     const rawResponse = await response.text(); // Log raw response
//     console.log('Weaviate Response:', rawResponse);

//     if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
//       throw new Error(`Invalid response: ${rawResponse}`);
//     }

//     const data = JSON.parse(rawResponse); // Parse manually to ensure JSON
//     res.setHeader('Content-Type', 'application/json'); // Explicitly set content type
//     res.json(data);
//   } catch (error) {
//     console.error('Direct fetch failed:', error.message);
//     res.status(500).json({ error: error.message });
//   }
// });

// // Update /all-zip-data to query Weaviate for all RealEstate data
// app.get('/all-zip-data', (req, res) => {
//     const zipData = {};
//     let rowCount = 0; // For debugging row processing
  
//     fs.createReadStream('data/realtor-data.zip.csv')
//       .pipe(csvParser())
//       .on('data', (row) => {
//         console.log(`Row processed: ${JSON.stringify(row)}`);

//         rowCount++;
//         const zipCode = row.zip_code?.trim();
//         if (!zipData[zipCode]) zipData[zipCode] = [];
//         zipData[zipCode].push({
//           price: parseFloat(row.price) || null,
//           bedrooms: parseInt(row.bedrooms, 10) || null,
//         });
//       })
//       .on('end', () => {
//         console.log(`Processed ${rowCount} rows from the CSV file.`); // Debugging
//         res.json(zipData); // Send the entire dataset
//       })
//       .on('error', (error) => {
//         console.error('Error reading CSV file:', error.message);
//         res.status(500).json({ error: 'Failed to read CSV file' });
//       });
//   });
  
  

// const PORT = 3001;

// app.listen(PORT, () => {
//   console.log(`Proxy server running on http://localhost:${PORT}`);
// });


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





// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import fs from 'fs';
// import csvParser from 'csv-parser';
// import compression from 'compression';

// dotenv.config();

// const app = express();
// let zipData = {}; // To store preprocessed data

// // Enable JSON and URL-encoded parsing with appropriate size limits
// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// // Enable CORS for the frontend
// app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// // Enable compression
// app.use(
//   compression({
//     filter: (_req, _res) => true, // Apply compression for all responses
//   })
// );

// // Middleware for query parameter validation
// app.use((req, res, next) => {
//   const { zip_code, page, limit } = req.query;

//   if (zip_code && typeof zip_code !== 'string') {
//     return res.status(400).json({ error: 'Invalid ZIP code parameter' });
//   }
//   if (page && (!Number.isInteger(+page) || +page <= 0)) {
//     return res.status(400).json({ error: 'Invalid page parameter' });
//   }
//   if (limit && (!Number.isInteger(+limit) || +limit <= 0)) {
//     return res.status(400).json({ error: 'Invalid limit parameter' });
//   }

//   next();
// });

// // Preprocess CSV data on server startup
// const preprocessData = () => {
//   fs.createReadStream('data/realtor-data.zip.csv')
//     .pipe(csvParser())
//     .on('data', (row) => {
//       const zipCode = row.zip_code?.trim();
//       const zipPrefix = zipCode ? zipCode.slice(0, 3) : null; // Extract the first 3 digits

//       if (!zipCode) {
//         console.log('Skipping row without ZIP code:', row); // Debugging skipped rows
//         return;
//       }

//       console.log('Processing ZIP code:', zipCode); // Debugging processed ZIP codes

//       if (!zipData[zipCode]) {
//         zipData[zipCode] = [];
//       }

//       zipData[zipCode].push({
//         price: parseFloat(row.price) || null,
//         bedrooms: parseInt(row.bedrooms, 10) || null,
//         zip_code: zipCode,
//         zip_prefix: zipPrefix, // Add this field
//         city: row.city,
//         state: row.state?.trim(), // Ensure state is trimmed
//         house_size: parseInt(row.house_size, 10) || null,
//       });
//     })
//     .on('end', () => {
//       console.log('CSV file successfully processed and preloaded.');

//       // Log unique states
//       const uniqueStates = new Set();
//       Object.values(zipData).flat().forEach((item) => {
//         if (item.state) uniqueStates.add(item.state);
//       });
//       console.log('Unique States:', Array.from(uniqueStates));

//       // Check if 10504 exists in the data
//       console.log('Does 10504 exist in zipData?', zipData['10504'] ? 'Yes' : 'No');
//     })
//     .on('error', (err) => {
//       console.error('Error processing CSV:', err.message);
//     });
// };

// preprocessData(); // Run preprocessing when the server starts

// // Updated `/all-zip-data` Endpoint
// app.get('/all-zip-data', (req, res) => {
//   const { zip_code, zip_prefix, state, page = 1, limit = 10 } = req.query;

//   console.log('Received query params:', { zip_code, zip_prefix, state, page, limit });

//   let results = Object.values(zipData).flat(); // Flatten the data to process all ZIP codes
//   console.log('Initial data length:', results.length);

//   // Filter by ZIP code if specified
//   if (zip_code) {
//     console.log('Filtering for zip_code:', zip_code);
//     results = results.filter(item => item.zip_code === zip_code.trim());
//     console.log(`After zip_code filter: ${results.length} results found`);
//   }

//   // Filter by ZIP prefix if specified
//   if (zip_prefix) {
//     console.log('Filtering for zip_prefix:', zip_prefix);
//     results = results.filter(item => item.zip_prefix === zip_prefix.trim());
//     console.log(`After zip_prefix filter: ${results.length} results found`);
//   }

//   // Filter by state if specified
//   if (state) {
//     console.log('Filtering for state:', state);
//     results = results.filter(item => item.state?.toLowerCase() === state.trim().toLowerCase());
//     console.log(`After state filter: ${results.length} results found`);
//   }

//   // Handle empty results
//   if (results.length === 0) {
//     console.log('No matching data found for the query.');
//     return res.status(404).json({ error: 'No data found for the specified criteria' });
//   }

//   // Apply pagination
//   const startIndex = (page - 1) * limit;
//   const paginatedResults = results.slice(startIndex, startIndex + limit);

//   console.log(`Returning ${paginatedResults.length} results for page ${page} with limit ${limit}`);
//   res.json(paginatedResults);
// });

// // Root Route
// app.get('/', (req, res) => {
//   res.json({
//     message: 'Welcome to the WeaveSense Proxy Server!',
//     availableRoutes: [
//       '/all-zip-data?zip_code=<zip_code>&page=<page>&limit=<limit>',
//       '/all-zip-data?zip_code=<zip_code>&summary=true',
//     ],
//   });
// });

// // Start the server
// const PORT = 3001;
// app.listen(PORT, () => {
//   console.log(`Proxy server running on http://localhost:${PORT}`);
// });

