import React, { useEffect, useState } from "react";
import "./ShopDropDown.css";

const ShopDropDown = ({ selectedShop, onShopChange, userRole }) => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const res = await fetch(`${API_URL}/api/restaurant/all`);
        const data = await res.json();
        setShops(data);
      } catch (error) {
        console.error("Ошибка при загрузке ресторанов:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  return (
    <div className="shopdropdown-container">
      {loading ? (
        <select className="shop-dropdown" disabled>
          <option>Загрузка...</option>
        </select>
      ) : (
        <select
          className="shop-dropdown"
          value={selectedShop || ""}
          onChange={(e) => onShopChange(e.target.value)}
          disabled={userRole !== "superadmin"} // 👈 только супер-админ может менять
        >
          <option value="">Выберите ресторан</option>
          {shops.length > 0 ? (
            shops.map((shop) => (
              <option key={shop._id} value={shop._id}>
                {shop.name}
              </option>
            ))
          ) : (
            <option disabled>Нет ресторанов</option>
          )}
        </select>
      )}
    </div>
  );
};

export default ShopDropDown;
