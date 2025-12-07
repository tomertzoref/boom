import React, { useState, useRef, useEffect } from 'react';
import SearchWidget from './components/SearchWidget';
import SearchResults from './components/SearchResults';
import './App.css';

function App() {
  const [location, setLocation] = useState('');
  const [adults, setAdults] = useState(1);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const resultsRef = useRef(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!location.trim()) {
      setError('אנא הזן מיקום');
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location: location.trim(),
          adults: parseInt(adults),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'שגיאה בחיפוש');
      }

      // Server returns array directly (server.js line 173: res.json(results))
      // So we only need to check if it's an array
      if (!Array.isArray(data)) {
        // If it's not an array, it might be an error object
        if (data.error) {
          throw new Error(data.error + (data.message ? '\n' + data.message : ''));
        }
        // If it's a single object, wrap it in an array
        setResults([data]);
      } else {
        setResults(data);
      }
    } catch (err) {
      setError(err.message || 'שגיאה בחיבור לשרת');
      console.error('Search error:', err);
      
      // Show suggestion for API errors
      if (err.message && err.message.includes('API')) {
        setError(err.message + '\n\nנסה עם ערים באנגלית כמו: London, Paris, New York, Tel Aviv');
      }
    } finally {
      setLoading(false);
    }
  };

  // Auto-scroll to results when they are loaded
  useEffect(() => {
    if (results.length > 0 && resultsRef.current) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        resultsRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    }
  }, [results]);

  return (
    <div className="App">
      <SearchWidget
        location={location}
        adults={adults}
        loading={loading}
        error={error}
        onLocationChange={setLocation}
        onAdultsChange={setAdults}
        onSearch={handleSearch}
      />
      
      <div ref={resultsRef}>
        <SearchResults results={results} />
      </div>
    </div>
  );
}

export default App;
