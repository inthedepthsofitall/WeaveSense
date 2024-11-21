export const fetchData = async (url) => {
    try {
      const response = await fetch(url, { method: 'GET' });
  
      console.log('Response Headers:', [...response.headers.entries()]); // Log headers
  
      if (!response.ok) {
        const errorMessage = `Error ${response.status}: ${response.statusText}`;
        console.error('API Error:', errorMessage);
        throw new Error(errorMessage);
      }
  
      const contentType = response.headers.get('Content-Type');
      console.log('Content-Type:', contentType); // Log Content-Type
  
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid response type. Expected application/json.');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error fetching data:', error.message);
      throw error;
    }
  };
  