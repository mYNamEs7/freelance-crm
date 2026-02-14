import { useEffect, useState } from "react";
import { api } from "../api/http";
import { addOrder } from "../api/orders";
import { useNavigate, useParams } from "react-router-dom";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import Loader from "../components/Loader";
import BackButton from "../components/BackButton";

/* ================== TYPES ================== */

export const OrderStatus = {
  NEW: "new",
  ACTIVE: "active",
  ARCHIVED: "archived",
} as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

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
  status: OrderStatus;
  notes: string;
  is_paid: boolean;
};

/* ================== COMPONENT ================== */

export default function Orders() {
  const { client_id } = useParams<{ client_id: string }>();
  const navigate = useNavigate();

  if (!client_id) return <div>Client not found</div>;

  /* ===== DATA ===== */
  const [client, setClient] = useState<Client | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  /* ===== ADD / EDIT ===== */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editOrder, setEditOrder] = useState<Order | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [status, setStatus] = useState<OrderStatus>(OrderStatus.NEW);
  const [notes, setNotes] = useState("");
  const [isPaid, setIsPaid] = useState(false);

  /* ================== API ================== */

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

  /* ================== HANDLERS ================== */

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

  /* ================== EFFECT ================== */

  useEffect(() => {
    fetchData();
  }, [client_id]);

  /* ================== RENDER ================== */

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="page">
      <BackButton />
      <h2 className="title">Заказы</h2>

      {client && (
        <div className="client-card">
          <p><strong>{client.name}</strong></p>
          <p>📞 {client.contact}</p>
          <p className="muted">{client.notes}</p>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="empty">
          <p>Заказов пока нет</p>
          <button className="add-btn" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> Создать первый заказ
          </button>
        </div>
      ) : (
        <>
          <div className="cards">
            {orders.map((order) => (
              <div key={order.id} className="card">
                <div
                  className="card-content"
                  onClick={() => navigate(`/orders/get/${order.id}`)}
                >
                  <h4>{order.title}</h4>
                  <p className="muted">{order.description.length >= 28 ? `${order.description.slice(0, 28)}...` : order.description}</p>
                  <p>💰 {order.price}</p>
                  <p>📌 {order.status}</p>
                  <p>{order.is_paid ? "✅ Оплачено" : "❌ Не оплачено"}</p>
                </div>

                <div className="card-actions">
                  <button onClick={() => setEditOrder(order)}>
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => onDeleteOrder(order.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="add-wrapper">
            <button className="add-btn" onClick={() => setIsModalOpen(true)}>
              <Plus size={16} /> Добавить заказ
            </button>
          </div>
        </>
      )}

      {(isModalOpen || editOrder) && (
        <div className="modal-backdrop" onClick={() => { setIsModalOpen(false); setEditOrder(null); }}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => { setIsModalOpen(false); setEditOrder(null); }}>
              <X />
            </button>

            <h3>{editOrder ? "Редактировать заказ" : "Новый заказ"}</h3>

            <form onSubmit={editOrder ? (e) => { e.preventDefault(); onSaveEdit(); } : onAddOrder}>
              <input value={editOrder?.title ?? title} onChange={(e) => editOrder ? setEditOrder({ ...editOrder, title: e.target.value }) : setTitle(e.target.value)} placeholder="Название" required />
              <textarea value={editOrder?.description ?? description} onChange={(e) => editOrder ? setEditOrder({ ...editOrder, description: e.target.value }) : setDescription(e.target.value)} placeholder="Описание" />
              <input type="number" value={editOrder?.price ?? price} onChange={(e) => editOrder ? setEditOrder({ ...editOrder, price: +e.target.value }) : setPrice(+e.target.value)} />
              <select
                value={editOrder?.status ?? status} // берем статус из редактируемого заказа или из обычного состояния
                onChange={(e) => editOrder ? setEditOrder({ ...editOrder, status: (e.target.value as OrderStatus) }) : setStatus(e.target.value as OrderStatus)}
              >
                <option value={OrderStatus.NEW}>Новый</option>
                <option value={OrderStatus.ACTIVE}>Активный</option>
                <option value={OrderStatus.ARCHIVED}>Архив</option>
              </select>
              <label>
                <input type="checkbox" checked={editOrder?.is_paid ?? isPaid} onChange={(e) => editOrder ? setEditOrder({ ...editOrder, is_paid: e.target.checked }) : setIsPaid(e.target.checked)} />
                Оплачено
              </label>
              <button type="submit" className="submit">Сохранить</button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .page {
          min-height: 100vh;
          padding: 32px;
          font-family: 'Segoe UI', sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .title {
          font-size: 36px;
          margin-bottom: 24px;
        }

        .client-card {
          text-align: center;
          margin-bottom: 32px;
        }

        .muted {
          opacity: 0.7;
        }

        .cards {
          width: 100%;
          max-width: 1400px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 24px;
        }

        .card {
          width: 280px;
          padding: 20px;
          border-radius: 12px;
          background: var(--bg);
          border: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .card-content {
          cursor: pointer;
        }

        .card-actions {
          display: flex;
          gap: 8px;
          margin-top: 12px;
        }

        .card-actions button {
          background: transparent;
          border: none;
          cursor: pointer;
        }

        .add-wrapper {
          margin-top: 32px;
        }

        .add-btn, .submit {
          background: #1976d2;
          color: white;
          border: none;
          padding: 14px 24px;
          border-radius: 10px;
          font-weight: bold;
          cursor: pointer;
          display: inline-flex;
          gap: 8px;
          align-items: center;
        }

        .empty {
          text-align: center;
          margin-top: 80px;
        }

        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,.4);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .modal {
          background: var(--bg);
          padding: 28px;
          border-radius: 12px;
          width: 420px;
          position: relative;
        }

        .close {
          position: absolute;
          right: 12px;
          top: 12px;
          background: none;
          border: none;
          cursor: pointer;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 16px;
        }

        input, textarea, select {
          padding: 12px;
          border-radius: 8px;
          border: 1px solid var(--border);
          background: var(--input);
          color: var(--text);
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
