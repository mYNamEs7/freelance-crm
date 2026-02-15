import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import Login from "../pages/Login";
import Register from "../pages/Register";
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
        <Route path="/auth/register" element={<Register />} />
        <Route
          path="/"
          element={isAuth() ? <AppLayout /> : <Navigate to="/auth/login" />}
        >
          <Route index element={<Dashboard />} />
          <Route path="clients" element={<Clients />} />
          <Route path="orders/all/:client_id" element={<Orders />} />
          <Route path="orders/get/:order_id" element={<OrderPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}