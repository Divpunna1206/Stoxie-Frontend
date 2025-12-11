// src/api/authInterceptor.ts
import apiClient from "./client";

const AUTH_TOKEN_KEY = "stoxie_token";

/**
 * Call this ONCE when your app starts.
 * Example in main.tsx:
 *
 *   import { setupAuthInterceptors } from "./api/authInterceptor";
 *   setupAuthInterceptors();
 */
export function setupAuthInterceptors() {
  // Request interceptor – attach token
  apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);

      if (token) {
        config.headers = config.headers ?? {};
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor – optional 401 handling
  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === 401) {
        // You can optionally clear token or redirect to login:
        // localStorage.removeItem(AUTH_TOKEN_KEY);
      }
      return Promise.reject(error);
    }
  );
}

// Optionally handle unauthorized responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      // Optionally log out:
      // localStorage.removeItem(AUTH_TOKEN_KEY);
    }
    return Promise.reject(error);
  }
);

// No exports needed – just import this file ONCE in your app startup,
// e.g. in main.tsx:  import "./api/authInterceptor";
