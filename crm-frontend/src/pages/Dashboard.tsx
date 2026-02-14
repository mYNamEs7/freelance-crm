// src/pages/Dashboard.tsx

import { useEffect, useState } from "react";
import { api } from "../api/http";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

type User = {
  id: number;
  email: string;
};

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // запрашиваем текущего пользователя с бекенда
    api.get("/user/me")
      .then((res) => setUser(res.data))
      .catch(() => {
        // если токен битый — выкидываем на логин
        localStorage.removeItem("access_token");
        window.location.href = "/auth/login";
      });
  }, []);

  const handleLogout = () =>
  {
    var token = !!localStorage.getItem("access_token")
    if (!token) return;
    
    localStorage.removeItem("access_token");
    navigate("/auth/login");
  };
  
  if (!user) {
    return <Loader />;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Вы вошли как: <b>{user.email}</b></p>
      <button onClick={() => navigate("/clients")}>Clients</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}