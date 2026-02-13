// src/api/http.ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

// interceptor — подставляет JWT автоматически
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});