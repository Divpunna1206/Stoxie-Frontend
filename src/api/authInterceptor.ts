// src/api/authInterceptor.ts
import { apiClient } from "./client";

export function setupAuthInterceptors() {
  // Attach token to every request
  apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("stoxie_token");

      if (token) {
        config.headers = {
          ...(config.headers || {}),
          Authorization: `Bearer ${token}`,
        };
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Handle 401 responses (optional)
  apiClient.interceptors.response.use(
    (response) => response,
    (error: any) => {
      if (error?.response?.status === 401) {
        console.warn("[AUTH] 401 from API – token invalid/expired.");
      }
      return Promise.reject(error);
    }
  );
}
