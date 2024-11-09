const API_URL = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL  // Will be set in Vercel environment variables
  : 'http://localhost:5000';      // Local development using port 5000

export default API_URL;
