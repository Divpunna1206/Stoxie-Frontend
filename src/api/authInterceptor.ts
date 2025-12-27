// // src/api/authInterceptor.ts
// import apiClient from "./client";

// const AUTH_TOKEN_KEY = "stoxie_token";

// export function setupAuthInterceptors() {
//   apiClient.interceptors.request.use(
//     (config) => {
//       const token = localStorage.getItem(AUTH_TOKEN_KEY);
//       if (token) {
//         config.headers = config.headers ?? {};
//         if (!config.headers["Authorization"]) {
//           config.headers["Authorization"] = `Bearer ${token}`;
//         }
//       }
//       return config;
//     },
//     (error) => Promise.reject(error)
//   );

//   apiClient.interceptors.response.use(
//     (response) => response,
//     (error) => {
//       if (error?.response?.status === 401) {
//         // optional: localStorage.removeItem(AUTH_TOKEN_KEY);
//       }
//       return Promise.reject(error);
//     }
//   );
// }

// src/api/authInterceptor.ts
import apiClient from "./client";

const AUTH_TOKEN_KEY = "stoxie_token";

export function setupAuthInterceptors() {
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

  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === 401) {
        // ✅ token expired (72h) => force fresh login
        localStorage.removeItem(AUTH_TOKEN_KEY);
      }
      return Promise.reject(error);
    }
  );
}
