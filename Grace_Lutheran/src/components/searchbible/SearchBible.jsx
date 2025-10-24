import React, { useState } from 'react';
import './SearchBible.css';
import { API_KEY } from '../../../my_key.jsx';

const BIBLE_ID = '685d1470fe4d5c3b-01';

const SearchBible = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults([]);
    try {
      const res = await fetch(
        `https://api.scripture.api.bible/v1/bibles/${BIBLE_ID}/search?query=${encodeURIComponent(query)}&limit=50`,
        {
          headers: {
            'api-key': API_KEY,
          },
        }
      );
      const data = await res.json();
      if (data && data.data && data.data.verses && data.data.verses.length > 0) {
        setResults(data.data.verses);
      } else if (data && data.data && data.data.passages && data.data.passages.length > 0) {
        setResults(data.data.passages);
      } else {
        setError('No results found.');
      }
    } catch {
      setError('Error fetching results.');
    }
    setLoading(false);
  };

  return (
    <div className="search-bible">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="e.g. faith, love, Matthew 1:20, hope"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" disabled={loading}>Search</button>
      </form>
      {loading && <p>Loading...</p>}
  {error && <p className="search-error">{error}</p>}
      <div className="search-results">
        {results.map((item, idx) => (
          <div key={idx} className="search-result">
            <h4>{item.reference}</h4>
            {item.content ? (
              <div className="text eb-container" dangerouslySetInnerHTML={{ __html: item.content }} />
            ) : (
              <p>{item.text}</p>
            )}
          </div>
        ))}
      </div>
      <footer className="search-footer">
        <hr />
        <p>Search powered by API.Bible. Results from American Standard Version .</p>
        
      </footer>
    </div>
  );
};

export default SearchBible;
