import { useEffect, useState } from "react";
import { api } from "../api/http";
import { addOrder } from "../api/orders";
import { useNavigate, useParams } from "react-router-dom";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import Loader from "../components/Loader";
import BackButton from "../components/BackButton";

export const OrderStatus = {
  NEW: "new",
  ACTIVE: "active",
  ARCHIVED: "archived",
} as const;

export type OrderStatusType = (typeof OrderStatus)[keyof typeof OrderStatus];

type Client = {
  id: number;
  name: string;
  contact: string;
  notes: string;
};

type Order = {
  id: number;
  title: string;
  description: string;
  price: number;
  status: OrderStatusType;
  notes: string;
  is_paid: boolean;
};

export default function Orders() {
  const { client_id } = useParams<{ client_id: string }>();
  const navigate = useNavigate();

  if (!client_id) return <div className="p-4 sm:p-6 lg:p-8 text-slate-500 dark:text-slate-400">Клиент не найден</div>;

  const [client, setClient] = useState<Client | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editOrder, setEditOrder] = useState<Order | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [status, setStatus] = useState<OrderStatusType>(OrderStatus.NEW);
  const [notes, setNotes] = useState("");
  const [isPaid, setIsPaid] = useState(false);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      api.get(`/clients/get/${client_id}`).then((r) => r.data),
      api.get(`/orders/all/${client_id}`).then((r) => r.data),
    ])
      .then(([clientData, ordersData]) => {
        setClient(clientData);
        setOrders(ordersData);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  function resetForm() {
    setTitle("");
    setDescription("");
    setPrice(0);
    setStatus(OrderStatus.NEW);
    setNotes("");
    setIsPaid(false);
  }

  async function onAddOrder(e: React.FormEvent) {
    e.preventDefault();
    await addOrder(
      Number(client_id),
      title,
      description,
      price,
      status,
      notes,
      isPaid
    );
    api.get(`/orders/all/${client_id}`).then((r) => setOrders(r.data));
    resetForm();
    setIsModalOpen(false);
  }

  async function onSaveEdit() {
    if (!editOrder) return;
    await api.put(`/orders/update/${editOrder.id}`, editOrder);
    api.get(`/orders/all/${client_id}`).then((r) => setOrders(r.data));
    setEditOrder(null);
  }

  async function onDeleteOrder(id: number) {
    if (!confirm("Удалить заказ?")) return;
    await api.delete(`/orders/delete/${id}`);
    api.get(`/orders/all/${client_id}`).then((r) => setOrders(r.data));
  }

  useEffect(() => {
    fetchData();
  }, [client_id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <BackButton />
      <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4 sm:mb-6">
        Заказы
      </h2>

      {client && (
        <div className="mb-6 sm:mb-8 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-center">
          <p className="font-semibold text-slate-800 dark:text-slate-100">
            {client.name}
          </p>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            📞 {client.contact}
          </p>
          {client.notes && (
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
              {client.notes}
            </p>
          )}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            Заказов пока нет
          </p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
          >
            <Plus size={20} />
            Создать первый заказ
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="w-full max-w-sm mx-auto sm:max-w-none sm:mx-0 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
              >
                <button
                  type="button"
                  onClick={() => navigate(`/orders/get/${order.id}`)}
                  className="flex-1 p-5 text-left hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                >
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100 truncate">
                    {order.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {order.description}
                  </p>
                  <p className="text-slate-700 dark:text-slate-200 mt-2 font-medium">
                    💰 {order.price} ₽
                  </p>
                  <span
                    className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === OrderStatus.NEW
                        ? "bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200"
                        : order.status === OrderStatus.ACTIVE
                          ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200"
                          : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {order.status}
                  </span>
                  <p className="text-sm mt-2">
                    {order.is_paid ? "✅ Оплачено" : "❌ Не оплачено"}
                  </p>
                </button>
                <div className="p-2 flex gap-2 border-t border-slate-100 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setEditOrder(order)}
                    className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteOrder(order.id)}
                    className="p-2 rounded-lg text-slate-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center sm:justify-start mt-6 sm:mt-8">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm sm:text-base"
            >
              <Plus size={20} />
              Добавить заказ
            </button>
          </div>
        </>
      )}

      {(isModalOpen || editOrder) && (
        <div
          className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
          onClick={() => {
            setIsModalOpen(false);
            setEditOrder(null);
          }}
        >
          <div
            className="bg-white dark:bg-slate-800 rounded-t-2xl sm:rounded-2xl shadow-xl w-full max-h-[90vh] overflow-y-auto sm:max-w-md relative p-4 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setEditOrder(null);
              }}
              className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
              {editOrder ? "Редактировать заказ" : "Новый заказ"}
            </h3>
            <form
              onSubmit={
                editOrder
                  ? (e) => {
                      e.preventDefault();
                      onSaveEdit();
                    }
                  : onAddOrder
              }
              className="space-y-4"
            >
              <input
                value={editOrder?.title ?? title}
                onChange={(e) =>
                  editOrder
                    ? setEditOrder({ ...editOrder, title: e.target.value })
                    : setTitle(e.target.value)
                }
                placeholder="Название"
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <textarea
                value={editOrder?.description ?? description}
                onChange={(e) =>
                  editOrder
                    ? setEditOrder({
                        ...editOrder,
                        description: e.target.value,
                      })
                    : setDescription(e.target.value)
                }
                placeholder="Описание"
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
              <input
                type="number"
                value={editOrder?.price ?? price}
                onChange={(e) =>
                  editOrder
                    ? setEditOrder({
                        ...editOrder,
                        price: +e.target.value,
                      })
                    : setPrice(+e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <select
                value={editOrder?.status ?? status}
                onChange={(e) =>
                  editOrder
                    ? setEditOrder({
                        ...editOrder,
                        status: e.target.value as OrderStatusType,
                      })
                    : setStatus(e.target.value as OrderStatusType)
                }
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value={OrderStatus.NEW}>Новый</option>
                <option value={OrderStatus.ACTIVE}>Активный</option>
                <option value={OrderStatus.ARCHIVED}>Архив</option>
              </select>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editOrder?.is_paid ?? isPaid}
                  onChange={(e) =>
                    editOrder
                      ? setEditOrder({
                          ...editOrder,
                          is_paid: e.target.checked,
                        })
                      : setIsPaid(e.target.checked)
                  }
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-slate-700 dark:text-slate-300">
                  Оплачено
                </span>
              </label>
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
              >
                Сохранить
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
