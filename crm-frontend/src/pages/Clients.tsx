import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { addClient } from "../api/clients";
import { api } from "../api/http";
import { setClientId } from "../api/orders";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import Loader from "../components/Loader";
import BackButton from "../components/BackButton";

type Client = {
  id: number;
  name: string;
  contact: string;
  notes: string;
};

export default function Clients() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [notes, setNotes] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editClient, setEditClient] = useState<Client | null>(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  setClientId(-1);

  const {
    data: clients = [],
    isLoading: loading,
  } = useQuery({
    queryKey: ["clients"],
    queryFn: () => api.get<Client[]>("/clients/all").then((res) => res.data),
  });

  function UpdateFields() {
    setName("");
    setContact("");
    setNotes("");
  }

  async function OnAddClient(e: React.FormEvent) {
    e.preventDefault();
    await addClient(name, contact, notes);
    queryClient.invalidateQueries({ queryKey: ["clients"] });
    UpdateFields();
    setIsModalOpen(false);
  }

  async function OnUpdateClient(e: React.FormEvent) {
    e.preventDefault();
    if (!editClient) return;
    await api.put(`/clients/update/${editClient.id}`, {
      name,
      contact,
      notes,
    });
    queryClient.invalidateQueries({ queryKey: ["clients"] });
    UpdateFields();
    setEditClient(null);
    setIsModalOpen(false);
  }

  async function OnDeleteClient(clientId: number) {
    if (!confirm("Удалить клиента?")) return;
    await api.delete(`/clients/delete/${clientId}`);
    queryClient.invalidateQueries({ queryKey: ["clients"] });
  }

  function OpenClient(clientId: number) {
    setClientId(clientId);
    navigate(`/orders/all/${clientId}`);
  }

  function OpenAddModal() {
    UpdateFields();
    setEditClient(null);
    setIsModalOpen(true);
  }

  function OpenEditModal(client: Client) {
    setEditClient(client);
    setName(client.name);
    setContact(client.contact);
    setNotes(client.notes);
    setIsModalOpen(true);
  }

  if (loading && clients.length === 0) {
    return <Loader />;
  }

  return (
    <div className="page">
      <div className="content">
        <BackButton />
        <h2 className="title">Клиенты</h2>
        <div className="cards-wrapper">
          <div className="cards">
            {clients.map((client) => (
              <div key={client.id} className="card">
                <div
                  className="card-content"
                  onClick={() => OpenClient(client.id)}
                >
                  <p>
                    <h4>{client.name}</h4> 
                  </p>
                  <p>
                    <p>📞 {client.contact}</p>
                  </p>
                  <p>
                    <p className="muted">{" "}
                    {client.notes.length > 50
                      ? client.notes.slice(0, 50) + "..."
                      : client.notes}</p>
                  </p>
                </div>

                <div className="card-actions">
                  <button onClick={() => OpenEditModal(client)}>
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => OnDeleteClient(client.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="add-btn-wrapper">
            <button className="add-btn" onClick={OpenAddModal}>
              <Plus size={16} /> Добавить клиента
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-btn"
              onClick={() => setIsModalOpen(false)}
            >
              <X size={18} />
            </button>

            <h3>
              {editClient ? "Редактировать клиента" : "Добавить клиента"}
            </h3>

            <form
              onSubmit={editClient ? OnUpdateClient : OnAddClient}
              className="modal-form"
            >
              <input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                placeholder="Contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
              <textarea
                placeholder="Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
              <button type="submit" className="submit-btn">
                {editClient ? "Сохранить" : "Добавить"}
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .page {
          width: 100%;
          min-height: 100vh;

          display: flex;
          flex-direction: column;
          align-items: center;      /* ⬅️ центр по горизонтали */
          justify-content: flex-start;

          font-family: 'Segoe UI', sans-serif;
        }

        .content {
          width: 100%;
          max-width: 1400px;
          padding: 0 16px;
        }

        .title {
          text-align: center;
          font-size: 36px;
          margin-bottom: 24px;
        }

        .cards-wrapper {
          width: 100%;
        }

        .cards {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          justify-content: center; /* карточки по центру */
          gap: 24px;
          min-height: 1px;         /* 🔥 фикс прыжков */
        }

        .card {
          width: 280px;
          background: var(--card-bg);
          color: var(--text-color);
          padding: 20px;
          border-radius: 12px;
          border: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.2);
        }

        .card-content p {
          margin: 6px 0;
          word-break: break-word;
          cursor: pointer;
        }

        .card-actions {
          margin-top: 12px;
          display: flex;
          gap: 8px;
        }

        .card-actions button {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 6px;
          border-radius: 6px;
        }

        .card-actions button:hover {
          background: rgba(0,0,0,0.1);
        }

        .add-btn-wrapper {
          display: flex;
          justify-content: center;
          margin-top: 32px;
        }

        .add-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background-color: #1976d2;
          color: white;
          border: none;
          padding: 14px 24px;
          border-radius: 10px;
          font-weight: bold;
          cursor: pointer;
        }

        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal {
          background: var(--card-bg);
          color: var(--text-color);
          padding: 28px;
          border-radius: 12px;
          width: 450px;
          max-width: 95%;
          position: relative;
        }

        .close-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          border: none;
          background: transparent;
          cursor: pointer;
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-top: 16px;
        }

        .modal-form input,
        .modal-form textarea {
          padding: 12px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          background-color: var(--input-bg);
          color: var(--text-color);
        }

        .submit-btn {
          background-color: #1976d2;
          color: white;
          border: none;
          padding: 12px 18px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
        }

        @media (prefers-color-scheme: dark) {
          :root {
            --card-bg: #1e1e1e;
            --text-color: #f0f0f0;
            --border-color: #333;
            --input-bg: #2a2a2a;
          }
        }

        @media (prefers-color-scheme: light) {
          :root {
            --card-bg: #fff;
            --text-color: #000;
            --border-color: #ccc;
            --input-bg: #f9f9f9;
          }
        }
      `}</style>
    </div>
  );
}
