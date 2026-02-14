// src/api/auth.ts
import { api } from "./http";

export const login = async (email: string, password: string) => {
  const res = await api.post("/auth/login", {
    email,
    password,
  });
  localStorage.setItem("access_token", res.data.access_token);
  return res.data;
};