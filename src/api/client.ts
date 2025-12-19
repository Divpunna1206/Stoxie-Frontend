// src/api/client.ts
import axios from "axios";

const API_BASE_URL =
  // import.meta.env.VITE_API_URL ?? "http://localhost:8000";
  import.meta.env.VITE_API_URL ?? "http://103.178.113.168:8000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// You can import either `apiClient` or default.
export default apiClient;

