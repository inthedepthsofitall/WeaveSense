import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

