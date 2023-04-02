import React, { useState } from 'react';
import { comparePrices, CarPart } from '../scraper/scrape';
import { db } from '../firebase/firebaseConfig';

interface SearchResult {
  autoZone: CarPart[];
  oReilly: CarPart[];
}

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult>({ autoZone: [], oReilly: [] });

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();

    const comparisonResults = await comparePrices(query);
    setResults(comparisonResults);

    db.collection('searchHistory').add({
      query: query,
      results: comparisonResults,
      createdAt: new Date(),
    });
  };

  return (
    <div>
      <h1>Search for Car Parts</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for car parts"
        />
        <button type="submit">Search</button>
      </form>
      <h2>AutoZone</h2>
      <ul>
        {results.autoZone.map((part, index) => (
          <li key={index}>
            {part.name} - ${part.price.toFixed(2)}
          </li>
        ))}
      </ul>
      <h2>O&rsquo;Reilly Auto Parts</h2>
      <ul>
        {results.oReilly.map((part, index) => (
          <li key={index}>
            {part.name} - ${part.price.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchPage;
