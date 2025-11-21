import React, { useContext, useEffect, useState } from "react";
import "./AddUser.css";
import { assets } from "../../assets/assets";
import { ShopContext } from "../../context/ShopContext";

const API_URL = import.meta.env.VITE_API_URL;

const AddUser = () => {
  const { selectedShop } = useContext(ShopContext);
  const [shops, setShops] = useState([]);
  const [selectedShopId, setSelectedShopId] = useState(selectedShop || "");
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    patronymic: "",
    username: "",
    password: "",
    phone: "",
    role: "",
  });

  // Загружаем список ресторанов
  useEffect(() => {
    const fetchShops = async () => {
      try {
        const res = await fetch(`${API_URL}/api/restaurant/all`);
        const data = await res.json();
        setShops(data);
      } catch (error) {
        console.error("Ошибка при загрузке ресторанов:", error);
      }
    };
    fetchShops();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedShopId) {
      alert("Выберите ресторан");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/admin-users/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, restaurantId: selectedShopId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Ошибка при добавлении");

      alert("Администратор успешно добавлен!");
      setFormData({
        lastName: "",
        firstName: "",
        patronymic: "",
        username: "",
        password: "",
        phone: "",
        role: "",
      });
    } catch (error) {
      console.error("Ошибка добавления администратора:", error);
      alert(error.message);
    }
  };

  return (
    <div className="add">
      <div className="h2-item">
        <h3 className="item-h2">ДОБАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯ</h3>
      </div>
      <hr className="divider" />

      <form className="form-container" onSubmit={handleSubmit}>
        <input
          type="text"
          name="lastName"
          placeholder="Фамилия"
          required
          className="addshop-input"
          value={formData.lastName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="firstName"
          placeholder="Имя"
          required
          className="addshop-input"
          value={formData.firstName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="patronymic"
          placeholder="Отчество"
          className="addshop-input"
          value={formData.patronymic}
          onChange={handleChange}
        />
        <input
          type="text"
          name="username"
          placeholder="Логин"
          required
          className="addshop-input"
          value={formData.username}
          onChange={handleChange}
        />

        <div className="add-shop-name password-container">
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            required
            className="addshop-input"
            value={formData.password}
            onChange={handleChange}
          />
          <img className="adduser-img" src={assets.eye_icon} alt="eye icon" />
        </div>

        <select
          name="role"
          required
          className="addshop-input"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="">Выберите роль</option>
          <option value="superadmin">superadmin</option>
          <option value="manager">manager</option>
          <option value="waiter">waiter</option>
        </select>

        <select
          value={selectedShopId}
          onChange={(e) => setSelectedShopId(e.target.value)}
          required
          className="addshop-input"
        >
          <option value="">Выберите ресторан</option>
          {shops.map((shop) => (
            <option key={shop._id} value={shop._id}>
              {shop.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="phone"
          placeholder="Телефон"
          required
          className="addshop-input"
          value={formData.phone}
          onChange={handleChange}
        />

        <button type="submit" className="add-btn">
          ДОБАВИТЬ
        </button>
      </form>
    </div>
  );
};

export default AddUser;
