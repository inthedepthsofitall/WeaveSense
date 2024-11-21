import React from 'react';

function Results({ data }) {
  if (!data || data.length === 0) {
    return null; 
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



  
  
  
  
  
  