import type { OrderStatus } from "../pages/Orders";
import { api } from "./http";

export var clientId = -1;

export const setClientId = (client_id: number) =>
{
  clientId = client_id;
}

export const addOrder = async (client_id: number, title: string, description: string, price: number, status: OrderStatus, notes: string, is_paid: boolean) => {
  await api.post("/orders/add", {
    client_id,
    title,
    description,
    price,
    status,
    notes,
    is_paid,
  });
};