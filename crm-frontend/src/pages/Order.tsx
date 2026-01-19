// ../pages/Orders.tsx

import { useEffect, useState } from "react";
import { api } from "../api/http";
import { useParams } from "react-router-dom";

export const OrderStatus = {
  NEW: "new",
  ACTIVE: "active",
  ARCHIVED: "archived",
} as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

type Order = {
  id: number;
  user_id: number;
  client_id: number;
  title: string;
  description: string;
  price: number;
  status: OrderStatus
  notes: string;
  is_paid: boolean;
}

export default function OrderPage()
{
  const [order, setOrder] = useState<Order>();

  const { order_id } = useParams<{ order_id: string }>();

  if (!order_id)
  {
    return <div>Order not found</div>;
  }

  function GetOrder()
  {
    api.get("/orders/get/" + Number(order_id)).then((res) => setOrder(res.data));
  }

  useEffect(() =>
  {
    if (!order_id) return;
    GetOrder();
  }, [order_id]);

  return (
    <div className="order-container">
      {order && (
        <div className="order-card">
          <h3 className="order-title">Заказ</h3>
          <div className="order-field">
            <h4>{order.title}</h4>
          </div>
          <div className="order-field">
            <p className="muted">{order.description}</p>
          </div>
          <div className="order-field">
            💰 {order.price} ₽
          </div>
          <div className="order-field">
            <span className={`status-badge status-${order.status.toLowerCase()}`}>
              📌 {order.status}
            </span>
          </div>
          <div className="order-field">
            {order.is_paid ? "✅ Оплачено" : "❌ Не оплачено"}
          </div>
        </div>
      )}
      <style>{`
        .order-container {
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }

        .order-card {
          background: var(--bg); /* светлый фон */
          padding: 20px 30px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          max-width: 400px;
          width: 100%;
          font-family: Arial, sans-serif;
        }

        .order-title {
          margin-bottom: 16px;
          font-size: 20px;
          color: #4f46e5;
          text-align: center;
        }

        .order-field {
          margin-bottom: 10px;
          font-size: 16px;
        }

        .field-label {
          font-weight: 600;
          margin-right: 6px;
        }

        .status-badge {
          padding: 2px 8px;
          border-radius: 6px;
          color: white;
          font-weight: 500;
          text-transform: capitalize;
        }

        .status-new {
          background-color: #var(--bg);
        }

        .status-active {
          background-color: #var(--bg);
        }

        .status-archived {
          background-color: var(--bg);
        }

        @media (prefers-color-scheme: dark) {
          :root {
            --bg: #1e1e1e;
            --border: #333;
            --text: #fff;
            --input: #2a2a2a;
          }
        }

        @media (prefers-color-scheme: light) {
          :root {
            --bg: #fff;
            --border: #ccc;
            --text: #000;
            --input: #f9f9f9;
          }
        }
      `}</style>
    </div>
  );
}