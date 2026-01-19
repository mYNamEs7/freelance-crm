// src/router/index.tsx
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Clients from "../pages/Clients";
import Orders from "../pages/Orders";
import OrderPage from "../pages/Order";

const isAuth = () => !!localStorage.getItem("access_token");

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route
          path="/"
          element={isAuth() ? <Dashboard /> : <Navigate to="/auth/login" />}
        />
        <Route path="/clients" element={<Clients />} />
        <Route path="/orders/all/:client_id" element={<Orders />} />
        <Route path="/orders/get/:order_id" element={<OrderPage />} />
      </Routes>
    </BrowserRouter>
  );
}