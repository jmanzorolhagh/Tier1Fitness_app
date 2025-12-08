import { Alert } from 'react-native';

const API_BASE_URL = 'https://tier1fitness-app.onrender.com/api'; 

export const MY_DEMO_USER_ID = "cmhw533h40000v2pk92qrjsfe";

const logAndThrowError = (error: unknown) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  console.error(`[ NETWORK FAIL]`, errorMessage);
  throw error;
};

const api = {
  get: async <T>(endpoint: string): Promise<T> => {
    const fullUrl = `${API_BASE_URL}${endpoint}`;
    console.log(`[API REQUEST] GET ${fullUrl}`);

    try {
      const response = await fetch(fullUrl);
      
      if (!response.ok) {
        const text = await response.text();
        console.log(`[API ERROR] Status: ${response.status} | Body: ${text}`);
        throw new Error(`Server returned ${response.status}: ${text}`);
      }

      const json = await response.json();
      return json as T; 

    } catch (error) {
      logAndThrowError(error);
      throw error; 
    }
  },

  post: async <T>(endpoint: string, body: any): Promise<T> => {
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

      const json = await response.json();
      return json as T;

    } catch (error) {
      logAndThrowError(error);
      throw error;
    }
  },

  put: async <T>(endpoint: string, body: any): Promise<T> => {
    const fullUrl = `${API_BASE_URL}${endpoint}`;
    console.log(`[API REQUEST] PUT ${fullUrl}`);

    try {
      const response = await fetch(fullUrl, {
        method: 'PUT',
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

      const json = await response.json();
      return json as T;

    } catch (error) {
      logAndThrowError(error);
      throw error;
    }
  },
};

export default api;