import React, { useState, useContext } from "react";
import "./PushPage.css";
import { ShopContext } from "../../context/ShopContext";

const API_URL = import.meta.env.VITE_API_URL;

const PushPage = () => {
  const { selectedShop } = useContext(ShopContext);

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  // Лимиты
  const TITLE_LIMIT = 40;
  const MESSAGE_LIMIT = 120;

  const sendPush = async () => {
    setStatus("");

    if (!selectedShop) {
      setStatus("❌ Выберите ресторан");
      return;
    }

    if (!title.trim() || !message.trim()) {
      setStatus("❌ Заполните заголовок и текст");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${API_URL}/api/restaurant/${selectedShop}/notify-clients`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, message }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setStatus(`✅ Отправлено ${data.sent} клиентам`);
        setTitle("");
        setMessage("");
      } else {
        setStatus("❌ Ошибка: " + data.message);
      }
    } catch {
      setStatus("❌ Ошибка сети");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='add'>
      <div className="h2-item">
        <h3 className="item-h2">ОТПРАВИТЬ ПУШ</h3>
      </div>
      <hr className="shop-info-divider" />

      <div className='push-container'>

        <div className="push-field">
          <label className="push-label">
            Заголовок уведомления ({title.length}/{TITLE_LIMIT})
          </label>

          <input
            type="text"
            className="push-input"
            placeholder="Введите заголовок..."
            value={title}
            maxLength={TITLE_LIMIT}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="push-field">
          <label className="push-label">
            Текст уведомления ({message.length}/{MESSAGE_LIMIT})
          </label>

          <textarea
            className="push-textarea"
            placeholder="Введите текст сообщения..."
            value={message}
            maxLength={MESSAGE_LIMIT}
            onChange={(e) => setMessage(e.target.value)}
            disabled={loading}
          />
        </div>

        <button
          className="push-btn"
          onClick={sendPush}
          disabled={loading || !selectedShop}
        >
          {loading ? "Отправка..." : "Отправить уведомление"}
        </button>

        {status && <p className="push-status">{status}</p>}
      </div>
    </div>
  );
};

export default PushPage;
