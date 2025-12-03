import { Alert } from 'react-native';

const API_BASE_URL = 'https://tier1fitness-app.onrender.com/api'; 
export const MY_DEMO_USER_ID = "cmhw533h40000v2pk92qrjsfe";

const api = {
  get: async (endpoint: string) => {
    const fullUrl = `${API_BASE_URL}${endpoint}`;
    console.log(`[API REQUEST] GET ${fullUrl}`);

    try {
      const response = await fetch(fullUrl);
      console.log(`[Unknown Status] ${response.status}`); // Debug log

      if (!response.ok) {
        const text = await response.text();
        console.log(`[API ERROR] Status: ${response.status} | Body: ${text}`);
        throw new Error(`Server returned ${response.status}: ${text}`);
      }

      const json = await response.json();
      return json;

    } catch (error: any) {
      console.error(`[☠️ NETWORK FAIL]`, error);
      throw error;
    }
  },

  post: async (endpoint: string, body: any) => {
    const fullUrl = `${API_BASE_URL}${endpoint}`;
    console.log(`[API REQUEST] POST ${fullUrl}`);

    try {
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const text = await response.text();
        console.log(`[API ERROR] Status: ${response.status} | Body: ${text}`);
        throw new Error(`Server returned ${response.status}: ${text}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error(`[NETWORK FAIL]`, error);
      throw error;
    }
  },
};

export default api;