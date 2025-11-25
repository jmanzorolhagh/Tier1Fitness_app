
const API_BASE_URL = 'http://PERSONALIP:3000/api';

export const MY_DEMO_USER_ID = 'YOUR_HARDCODED_USER_ID_FROM_PRISMA'; 



const api = {

  get: async (endpoint: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`[API GET Error] ${endpoint}:`, error);
      throw error;
    }
  },


  post: async (endpoint: string, body: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'API POST request failed');
      }
      return await response.json();
    } catch (error) {
      console.error(`[API POST Error] ${endpoint}:`, error);
      throw error;
    }
  },
};

export default api;