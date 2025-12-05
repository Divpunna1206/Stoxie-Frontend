// src/api/client.ts
import axios from "axios";

const API_BASE_URL =
//   import.meta.env.VITE_API_URL || "http://103.148.165.178:8000";
    "http://localhost:8000";
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
