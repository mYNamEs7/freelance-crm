import { useEffect, useState } from "react";
import { api } from "../api/http";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import BackButton from "../components/BackButton";

export const OrderStatus = {
  NEW: "new",
  ACTIVE: "active",
  ARCHIVED: "archived",
} as const;

export type OrderStatusType =
  (typeof OrderStatus)[keyof typeof OrderStatus];

type Order = {
  id: number;
  user_id: number;
  client_id: number;
  title: string;
  description: string;
  price: number;
  status: OrderStatusType;
  notes: string;
  is_paid: boolean;
};

export default function OrderPage() {
  const [order, setOrder] = useState<Order | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const { order_id } = useParams<{ order_id: string }>();

  if (!order_id) {
    return (
      <div className="p-8">
        <p>Order not found</p>
      </div>
    );
  }

  function GetOrder() {
    setLoading(true);
    api
      .get("/orders/get/" + Number(order_id))
      .then((res) => setOrder(res.data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    GetOrder();
  }, [order_id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <BackButton />
        <p className="text-slate-500 dark:text-slate-400">Заказ не найден</p>
      </div>
    );
  }

  const statusStyles = {
    new: "bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200",
    active:
      "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200",
    archived:
      "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300",
  };

  return (
    <div className="p-8 max-w-2xl mx-auto flex flex-col items-center">
      <div className="w-full max-w-md">
        <BackButton />
        <div className="rounded-2xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-600">
            <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 text-center">
              Заказ
            </h1>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <h2 className="font-semibold text-slate-800 dark:text-slate-100 text-lg">
                {order.title}
              </h2>
            </div>
            {order.description && (
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                {order.description}
              </p>
            )}
            <p className="text-slate-800 dark:text-slate-100 font-semibold">
              💰 {order.price} ₽
            </p>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusStyles[order.status as keyof typeof statusStyles] || statusStyles.archived}`}
            >
              📌 {order.status}
            </span>
            <p className="text-sm">
              {order.is_paid ? "✅ Оплачено" : "❌ Не оплачено"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
