// import { useState } from 'react';

// function SearchBar({ onSearch }) {
//   const [query, setQuery] = useState('');

//   const handleSubmit = (event) => {
//     if (!query.trim()) {
//       alert('Please enter a valid zip code.');
//       return;
//     }
//     onSearch(event, query);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="mb-4">
//       <input
//         type="text"
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//         placeholder="Enter zip code"
//         className="p-2 border border-gray-300 rounded"
//       />
//       <button type="submit" className="ml-2 p-2 bg-blue-500 text-white rounded">
//         Search
//       </button>
//     </form>
//   );
// }

// export default SearchBar;


import { useState } from 'react';

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission
    if (!query.trim()) {
      alert('Please enter a valid zip code.');
      return;
    }
    onSearch(event, query); // Pass query to the parent handler
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter zip code"
        className="p-2 border border-gray-300 rounded"
      />
      <button type="submit" className="ml-2 p-2 bg-blue-500 text-white rounded">
        Search
      </button>
    </form>
  );
}

export default SearchBar;

  
