// function Results({ results }) {
//     return (
//       <div className="mt-4 p-4 border-t">
//         <h2 className="text-xl font-semibold">Search Results:</h2>
//         <ul className="mt-2 list-disc pl-6">
//           {results.map((result, index) => (
//             <li key={index} className="text-gray-600">
//               <strong>Zip Code:</strong> {result.zip_code}, 
//               <strong> Price:</strong> ${result.price}, 
//               <strong> Bedrooms:</strong> {result.bedrooms}
//             </li>
//           ))}
//         </ul>
//       </div>
//     );
//   }
  
//   export default Results;
  

import React from 'react';

function Results({ data }) {
  if (!data || data.length === 0) {
    return <p>No results found.</p>; // Render a message if no data is available
  }

  return (
    <div>
      {data.map((item, index) => (
        <div key={`${item.zip_code}-${index}`} className="result-item">
          <p><strong>ZIP:</strong> {item.zip_code}, {item.state}</p>
          <p><strong>Price:</strong> ${item.price || 'N/A'}</p>
          <p><strong>Bedrooms:</strong> {item.bedrooms || 'N/A'}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default Results;



  
  
  
  
  
  