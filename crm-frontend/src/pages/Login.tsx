// src/pages/Login.tsx
import { useState } from "react";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    navigate("/");
  };

  return (
  <div className="form-container">
    <form onSubmit={onSubmit} className="login-form">
      <h2 className="form-title">Вход</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="form-input"
        type="email"
      />

      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="form-input"
      />

      <button type="submit" className="form-button">
        Login
      </button>
      </form>
      <style>{`
        .form-container {
          display: flex;
          justify-content: center;
          margin-top: 40px;
        }

        .login-form {
          background: var(--bg);
          padding: 30px 40px;
          border-radius: 12px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.1);
          width: 100%;
          max-width: 360px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          font-family: Arial, sans-serif;
        }

        .form-title {
          text-align: center;
          color: #4f46e5;
          font-size: 22px;
          margin-bottom: 20px;
          font-weight: 600;
        }

        .form-input {
          padding: 10px 14px;
          border-radius: 8px;
          border: 2px solid var(--border);
          font-size: 16px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .form-input:focus {
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
        }

        .form-button {
          background-color: #4f46e5;
          color: white;
          padding: 10px 0;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s, transform 0.1s;
        }

        .form-button:hover {
          background-color: #3730a3;
          transform: translateY(-1px);
        }

        .form-button:active {
          transform: translateY(0);
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