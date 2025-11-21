import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const API_URL = import.meta.env.VITE_API_URL;

const Login = ({ onLogin, setSelectedShop }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/admin-users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Ошибка входа");

      // сохраняем данные в localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("restaurantId", data.user.restaurant?._id || "");
      localStorage.setItem("username", data.user.name);

      // устанавливаем ресторан сразу
      if (data.user.restaurant?._id) {
        setSelectedShop(data.user.restaurant._id);
      }

      // сохраняем пользователя в App
      const newUser = {
        role: data.user.role,
        restaurantId: data.user.restaurant?._id,
        username: data.user.name,
      };
      onLogin(newUser);

      // ✅ Перенаправление по ролям
      if (newUser.role === "superadmin") {
        navigate("/");
      } else if (newUser.role === "manager") {
        navigate("/orders");
      } else if (newUser.role === "waiter") {
        navigate("/orders");
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-h2">Вход</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Логин"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Загрузка..." : "ВОЙТИ"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

