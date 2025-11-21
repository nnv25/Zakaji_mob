import React, { useContext, useEffect, useState } from "react";
import "./OrderList.css";
import { ShopContext } from "../../context/ShopContext";
import PageSelector from "../../components/PageSelector/PageSelector";
import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL;
const socket = io(API_URL);

const OrderList = () => {
  const { selectedShop } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 🔥 Загружаем заказы при выборе ресторана
  useEffect(() => {
    if (!selectedShop) {
      setOrders([]);
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`${API_URL}/api/orders/restaurant/${selectedShop}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Ошибка при загрузке заказов");

        setOrders(data);
      } catch (err) {
        console.error("Ошибка загрузки заказов:", err);
        setError("Не удалось загрузить заказы");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [selectedShop]);

  // 🔥 Слушаем WebSocket новые заказы
  useEffect(() => {
    if (!selectedShop) return;

    const handleNewOrder = (order) => {
      console.log("🔥 Новый заказ:", order);

      if (order.restaurant === selectedShop) {
        setOrders((prev) => [order, ...prev]);
      }
    };

    socket.on("newOrder", handleNewOrder);

    return () => {
      socket.off("newOrder", handleNewOrder);
    };
  }, [selectedShop]);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const handlePageChange = (page) => setCurrentPage(page);

  const handleToggleStatus = async (orderId) => {
    try {
      const res = await fetch(`${API_URL}/api/orders/${orderId}/toggle`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, active: data.active } : order
        )
      );
    } catch (error) {
      console.error("Ошибка при обновлении статуса:", error);
    }
  };

  return (
    <div className="my-shops">
      <h2 className="my-shops-h2">СПИСОК ЗАКАЗОВ</h2>
      <hr className="shop-info-divider" />

      {!selectedShop ? (
        <p className="info-text">Выберите ресторан, чтобы увидеть заказы</p>
      ) : loading ? (
        <p className="info-text">Загрузка заказов...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : orders.length === 0 ? (
        <p className="info-text">Заказов нет</p>
      ) : (
        <div className="container">
          <div className="cart-items">
            <div className="cart-items-title5">
              <p className="cart-items-name3">Заказ</p>
              <p className="cart-items-name3">Телефон</p>
              <p className="cart-items-name3">Дата</p>
              <p className="cart-items-name3">Сумма</p>
              <p className="cart-items-name3">Стол</p>
              <p className="cart-items-name3">Комментарий</p>
              <p className="cart-items-name3">Подтвердить</p>
              <p className="cart-items-name3">Статус</p>
            </div>
          </div>

          {orders.map((order) => (
            <div key={order._id} className="cart-items-title4 my-orders-order">
              <div className="order-information__wrapper">
                <p className="cart_item__txt2">
                  {order.items.map((item, index) => {
                    const name =
                      item.title?.length > 45
                        ? `${item.title.slice(0, 45)}...`
                        : item.title;
                    return `${name} x${item.quantity}${
                      index === order.items.length - 1 ? "" : ", "
                    }`;
                  })}
                </p>
              </div>
              <p className="cart_item__txt2">{order.user?.phone || "—"}</p>
              <p className="cart_item__txt2">{formatDate(order.createdAt)}</p>
              <p className="cart_item__txt2">{order.totalPrice.toFixed(2)} ₽</p>
              <p className="cart_item__txt2">{order.tableNumber || "—"}</p>
              <p className="cart_item__txt2 comment-cell">{order.comment || "Отсутствует"}</p>
              <button
                className="order-btn"
                onClick={() => handleToggleStatus(order._id)}
              >
                Подтвердить
              </button>
              <p className={order.active ? "status-active" : "status-inactive"}>
                {order.active ? "Активен" : "Не активен"}
              </p>
            </div>
          ))}

          <PageSelector
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default OrderList;


