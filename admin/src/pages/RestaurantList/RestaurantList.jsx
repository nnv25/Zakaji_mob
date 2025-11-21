import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import PageSelector from "../../components/PageSelector/PageSelector";
import { toast } from "react-toastify";
import "./RestaurantList.css";

const RestaurantList = () => {
  const [list, setList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  // ✅ Загрузка ресторанов с сервера
  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/restaurant/all`);
      const data = await res.json();
      setList(data);
      setTotalPages(1); // пока без серверной пагинации
    } catch (error) {
      console.error("Ошибка при загрузке ресторанов:", error);
      toast.error("❌ Ошибка при загрузке ресторанов");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  // ✅ Удаление ресторана
  const removeShop = async (id) => {
    if (!window.confirm("Вы уверены, что хотите удалить ресторан?")) return;

    try {
      const res = await fetch(`http://192.168.0.15:4000/api/restaurant/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        toast.success("✅ Ресторан успешно удалён");
        setList((prev) => prev.filter((r) => r._id !== id));
      } else {
        toast.error("⚠️ Не удалось удалить ресторан");
      }
    } catch (error) {
      console.error("Ошибка при удалении ресторана:", error);
      toast.error("❌ Ошибка при удалении ресторана");
    }
  };

  // ✅ Бан / Разбан ресторана
  const banShop = async (id) => {
    try {
      const res = await fetch(
        `${API_URL}/api/restaurant/ban/${id}`,
        { method: "PATCH" }
      );
      const data = await res.json();

      if (data.success) {
        toast.info(
          data.isBanned
            ? "🚫 Ресторан заблокирован"
            : "✅ Ресторан разблокирован"
        );
        fetchRestaurants();
      } else {
        toast.error("⚠️ Ошибка при изменении статуса ресторана");
      }
    } catch (error) {
      console.error("Ошибка при блокировке ресторана:", error);
      toast.error("❌ Ошибка при блокировке ресторана");
    }
  };

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <div className="my-shops">
      <h2 className="my-shops-h2">ВСЕ РЕСТОРАНЫ</h2>
      <hr className="shop-info-divider" />

      {loading ? (
        <p style={{ marginTop: 30 }}>Загрузка ресторанов...</p>
      ) : (
        <div className="container">
          <div className="cart-items">
            <div className="cart-items-title2">
              <div className="cart-item-wrapper2">
                <p className="cart-items-name2">Логотип</p>
              </div>
              <div className="cart-item-wrapper2">
                <p className="cart-items-name2">Название</p>
              </div>
              <div className="cart-item-wrapper2">
                <p className="cart-items-name2">Адрес</p>
              </div>
              <div className="cart-item-wrapper2">
                <p className="cart-items-name2">Время работы</p>
              </div>
              <div className="cart-item-wrapper2">
                <p className="cart-items-name2">Удалить</p>
              </div>
              <div className="cart-item-wrapper2">
                <p className="cart-items-name2">Забанить</p>
              </div>
            </div>
            <br />

            {list.map((item, index) => (
              <div
                key={index}
                className="cart-items-title2 my-orders-order"
                style={{
                  opacity: item.isBanned ? 0.5 : 1,
                  backgroundColor: item.isBanned ? "#f5f5f5" : "transparent",
                }}
              >
                <div className="logo_wrapper">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="shop_logo__wrapper"
                  />
                </div>

                <p className="cart_item__txt">{item.name}</p>
                <p className="cart_item__txt">{item.address}</p>

                <p className="cart_item__txt">
                  {item.worktime?.weekdays} / {item.worktime?.saturday} /{" "}
                  {item.worktime?.sunday}
                </p>

                <p onClick={() => removeShop(item._id)} className="cursor">
                  <img
                    className="cart_item__img"
                    src={assets.trash_icon}
                    alt="Удалить"
                  />
                </p>

                <p onClick={() => banShop(item._id)} className="cursor">
                  <img
                    className="cart_item__img"
                    src={item.isBanned ? assets.ban_icon : assets.nonban_icon}
                    alt={item.isBanned ? "Разбанить" : "Забанить"}
                  />
                </p>
              </div>
            ))}
          </div>

          <div className="cart-items__bottom"></div>
        </div>
      )}

      <PageSelector
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default RestaurantList;
