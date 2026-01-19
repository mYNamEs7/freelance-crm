import { api } from "./http";

export const addClient = async (name: string, contact: string, notes: string) => {
  await api.post("/clients/add", {
    name,
    contact,
    notes,
  });
};