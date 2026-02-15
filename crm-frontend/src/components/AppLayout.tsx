import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, LogOut, Menu, X } from "lucide-react";

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/auth/login");
    setSidebarOpen(false);
  };

  const nav = [
    { path: "/", label: "Главная", icon: LayoutDashboard },
    { path: "/clients", label: "Клиенты", icon: Users },
  ];

  const goTo = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const SidebarContent = () => (
    <>
      <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <h1 className="text-lg sm:text-xl font-bold text-indigo-600 dark:text-indigo-400">
          Freelance CRM
        </h1>
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
          aria-label="Закрыть меню"
        >
          <X size={22} />
        </button>
      </div>
      <nav className="p-3 flex flex-col gap-1">
        {nav.map(({ path, label, icon: Icon }) => {
          const isActive =
            path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(path);
          return (
            <button
              key={path}
              onClick={() => goTo(path)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-medium transition-colors ${
                isActive
                  ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Icon size={20} className="shrink-0" />
              {label}
            </button>
          );
        })}
      </nav>
      <div className="mt-auto p-3 border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          <LogOut size={20} className="shrink-0" />
          Выйти
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 lg:w-64 shrink-0 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile header + overlay menu */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 border-b border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-slate-800/80 flex items-center px-4">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
          aria-label="Меню"
        >
          <Menu size={24} />
        </button>
        <span className="ml-3 text-lg font-bold text-indigo-600 dark:text-indigo-400">
          Freelance CRM
        </span>
      </div>

      {sidebarOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
            aria-hidden
          />
          <aside className="md:hidden fixed top-0 left-0 z-50 h-full w-72 max-w-[85vw] border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex flex-col shadow-xl">
            <SidebarContent />
          </aside>
        </>
      )}

      <main className="flex-1 overflow-auto pt-14 md:pt-0 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
