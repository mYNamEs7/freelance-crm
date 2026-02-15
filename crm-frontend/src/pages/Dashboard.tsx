import { useEffect, useState } from "react";
import { api } from "../api/http";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { Users, ArrowRight } from "lucide-react";

type User = {
  id: number;
  email: string;
  username?: string;
};

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/user/me")
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("access_token");
        window.location.href = "/auth/login";
      });
  }, []);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
          Добро пожаловать{user.username ? `, ${user.username}` : ""}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm sm:text-base">
          {user.email}
        </p>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
        <button
          onClick={() => navigate("/clients")}
          className="group flex items-center gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800 transition-all text-left"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/60 transition-colors">
            <Users size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-slate-800 dark:text-slate-100">
              Клиенты
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Управление клиентами и заказами
            </p>
          </div>
          <ArrowRight size={20} className="text-slate-400 group-hover:text-indigo-500 shrink-0" />
        </button>
      </div>
    </div>
  );
}
