


// import { useState } from 'react';
// import NavBar from './components/NavBar';
// import SearchBar from './components/SearchBar';
// import Results from './components/Results';

// function App() {
//   const [searchResults, setSearchResults] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSearch = async (event, query) => {
//     event.preventDefault();
//     setIsLoading(true);
//     setSearchResults([]);

//     try {
//       const response = await fetch(`/test-direct-fetch?zip_code=${encodeURIComponent(query)}`, {
//         method: 'GET',
//       });

//       if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
//         throw new Error('Invalid response or content type');
//       }

//       const data = await response.json();
//       setSearchResults(data?.data?.Get?.RealEstate || []);
//     } catch (error) {
//       console.error('Error fetching data:', error.message);
//       alert('An error occurred while fetching data.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 text-white animate-fadeIn">
//       <NavBar />
//       <main className="p-4 text-center">
//         <h1 className="text-4xl font-bold mb-6 animate-fadeIn">Welcome to WeaveSense</h1>
//         <p className="text-lg mb-4">Explore knowledge using the power of Weaviate.</p>
//         <SearchBar onSearch={handleSearch} />
//         {isLoading && <p className="text-lg animate-fadeIn">Loading...</p>}
//         {searchResults.length > 0 && <Results results={searchResults} />}
//       </main>
//     </div>
//   );
// }

// export default App;


// import React, { useState } from 'react';
// import NavBar from './components/NavBar';
// import Results from './components/Results';
// import SearchBar from './components/SearchBar';
// import ErrorBoundary from './components/ErrorBoundary';
// import { fetchData } from './Api';

// function App() {
//   const [allZipData, setAllZipData] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [summary, setSummary] = useState(null); // For summary data
//   const [currentPage, setCurrentPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [zipCode, setZipCode] = useState(''); // Store the searched ZIP code

//   const handleSearch = async (event, query) => {
//     event.preventDefault();
//     const trimmedQuery = query.trim();
//     if (!trimmedQuery) return;

//     setZipCode(trimmedQuery); // Store the searched ZIP code
//     setSummary(null); // Clear previous summary
//     setAllZipData([]); // Clear previous results
//     setCurrentPage(1); // Reset pagination
//     setHasMore(true);

//     const newUrl = `/all-zip-data?zip_code=${encodeURIComponent(trimmedQuery)}&page=1&limit=10`;
//     window.history.pushState(null, '', newUrl);

//     setIsLoading(true);

//     try {
//       const data = await fetchData(newUrl);
//       if (data.length < 10) setHasMore(false);
//       setAllZipData(data);
//     } catch (error) {
//       console.error('Error fetching search results:', error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleLoadMore = async () => {
//     if (!hasMore) return;

//     const nextPage = currentPage + 1;
//     const newUrl = `/all-zip-data?zip_code=${encodeURIComponent(zipCode)}&page=${nextPage}&limit=10`;

//     setIsLoading(true);

//     try {
//       const data = await fetchData(newUrl);
//       if (data.length < 10) setHasMore(false);
//       setAllZipData((prevData) => [...prevData, ...data]);
//       setCurrentPage(nextPage);
//     } catch (error) {
//       console.error('Error fetching paginated data:', error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchSummary = async () => {
//     if (!zipCode) return;

//     const summaryUrl = `/all-zip-data?zip_code=${encodeURIComponent(zipCode)}&summary=true`;
//     setIsLoading(true);

//     try {
//       const data = await fetchData(summaryUrl);
//       setSummary(data);
//     } catch (error) {
//       console.error('Error fetching summary:', error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <ErrorBoundary>
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 text-white animate-fadeIn">
//         <NavBar />
//         <main className="p-4 text-center animate-fadeIn">
//           <h1 className="text-4xl font-bold mb-6">Welcome to WeaveSense</h1>
//           <p className="text-lg mb-4">Explore properties by ZIP code.</p>
//           <SearchBar onSearch={handleSearch} />
//           {summary && (
//             <div className="summary mt-4">
//               <p>
//                 Average Price: <strong>{summary.averagePrice.toFixed(2)}</strong>
//               </p>
//               <p>Total Listings: <strong>{summary.totalListings}</strong></p>
//             </div>
//           )}
//           <button onClick={fetchSummary} className="mt-4 px-4 py-2 bg-white text-blue-600 rounded">
//             View Summary
//           </button>
//           {isLoading ? (
//             <p>Loading...</p>
//           ) : (
//             <Results data={allZipData || []} />
//           )}
//           {hasMore && !isLoading && (
//             <button onClick={handleLoadMore} className="mt-4 px-4 py-2 bg-white text-blue-600 rounded">
//               Load More
//             </button>
//           )}
//         </main>
//       </div>
//     </ErrorBoundary>
//   );
// }

// export default App;




import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, createBrowserRouter } from 'react-router-dom';
import NavBar from './components/NavBar';
import SearchBar from './components/SearchBar';
import Results from './components/Results';
import ErrorBoundary from './components/ErrorBoundary';
import About from './components/About';
import Features from './components/Features';
import Contact from './components/Contact';
import { fetchData } from './Api';
import './App.css';

function App() {
  const [allZipData, setAllZipData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearch = async (event, query) => {
    event.preventDefault();
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setErrorMessage('Please enter a valid ZIP code.');
      return;
    }

    const backendUrl = `http://localhost:3001/all-zip-data?zip_code=${encodeURIComponent(trimmedQuery)}`;
    setIsLoading(true);
    setErrorMessage('');

    try {
      const data = await fetchData(backendUrl);
      setAllZipData(data);
    } catch (error) {
      console.error('Error fetching data:', error.message);
      setErrorMessage(
        error.message.includes('404') ? 'No data found for this ZIP code.' : 'Failed to fetch data. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <div className="app-container">
          <NavBar />
          <Routes>
            <Route
              path="/"
              element={
                <main className="main-content">
                  <h1 className="app-title">Welcome to WeaveSense</h1>
                  <p className="app-subtitle">Explore properties by ZIP code.</p>
                  <div className="search-bar-container">
                    <SearchBar onSearch={handleSearch} />
                  </div>
                  {errorMessage && <p className="error-message">{errorMessage}</p>}
                  {isLoading ? <p className="loading-text">Loading...</p> : <Results data={allZipData || []} />}
                </main>
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/features" element={<Features />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;

