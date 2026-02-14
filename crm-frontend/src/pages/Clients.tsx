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
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <BackButton />
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">
        Клиенты
      </h2>

      <div className="flex flex-wrap gap-6 justify-center">
        {clients.map((client) => (
          <div
            key={client.id}
            className="w-72 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
          >
            <button
              type="button"
              onClick={() => OpenClient(client.id)}
              className="flex-1 p-5 text-left hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
            >
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 truncate">
                {client.name}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                <span>📞</span> {client.contact}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">
                {client.notes || "—"}
              </p>
            </button>
            <div className="p-2 flex gap-2 border-t border-slate-100 dark:border-slate-700">
              <button
                type="button"
                onClick={() => OpenEditModal(client)}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                aria-label="Редактировать"
              >
                <Pencil size={18} />
              </button>
              <button
                type="button"
                onClick={() => OnDeleteClient(client.id)}
                className="p-2 rounded-lg text-slate-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                aria-label="Удалить"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <button
          type="button"
          onClick={OpenAddModal}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-500/25 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-colors"
        >
          <Plus size={20} />
          Добавить клиента
        </button>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md relative p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
              {editClient ? "Редактировать клиента" : "Добавить клиента"}
            </h3>
            <form
              onSubmit={editClient ? OnUpdateClient : OnAddClient}
              className="space-y-4"
            >
              <input
                placeholder="Имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                placeholder="Контакт"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <textarea
                placeholder="Заметки"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
              >
                {editClient ? "Сохранить" : "Добавить"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
