import React, { useEffect, useState, useContext } from "react";
import "./FoodList.css";
import PageSelector from "../../components/PageSelector/PageSelector";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { ShopContext } from "../../context/ShopContext";

const FoodList = () => {
  const { selectedShop } = useContext(ShopContext);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const API_URL = import.meta.env.VITE_API_URL;

  // ✅ Получаем блюда выбранного ресторана
  const fetchFoods = async () => {
    if (!selectedShop) {
      setList([]);
      toast.info("ℹ️ Выберите ресторан в навбаре, чтобы увидеть блюда");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `${API_URL}/api/food/all?restaurantId=${selectedShop}`
      );
      const data = await res.json();
      setList(data);
      setTotalPages(1);
    } catch (error) {
      console.error("Ошибка при загрузке блюд:", error);
      toast.error("❌ Ошибка при загрузке блюд");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, [selectedShop]);

  // ✅ Удаление блюда
  const removeProduct = async (id) => {
    if (!window.confirm("Удалить это блюдо?")) return;

    try {
      const res = await fetch(`${API_URL}/api/food/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        toast.success("✅ Блюдо успешно удалено");
        setList((prev) => prev.filter((food) => food._id !== id));
      } else {
        toast.error("⚠️ Ошибка при удалении блюда");
      }
    } catch (error) {
      console.error("Ошибка при удалении:", error);
      toast.error("❌ Ошибка соединения с сервером");
    }
  };

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <div className="my-shops">
      <h2 className="my-shops-h2">СПИСОК БЛЮД</h2>
      <hr className="shop-info-divider" />

      {!selectedShop ? (
        <p style={{ marginTop: 30 }}>
          🔍 Выберите ресторан в навбаре, чтобы увидеть список блюд.
        </p>
      ) : (
        <div className="container">
          <div className="cart-items">
            <div className="cart-items-title2">
              <div className="cart-item-wrapper2">
                <p className="cart-items-name2">Фотография</p>
              </div>
              <div className="cart-item-wrapper2">
                <p className="cart-items-name2">Название</p>
              </div>
              <div className="cart-item-wrapper2">
                <p className="cart-items-name2">Описание</p>
              </div>
              <div className="cart-item-wrapper2">
                <p className="cart-items-name2">Цена</p>
              </div>
              <div className="cart-item-wrapper2">
                <p className="cart-items-name2">Удалить</p>
              </div>
              <div className="cart-item-wrapper2">
                <p className="cart-items-name2">Изменить</p>
              </div>
            </div>
            <br />
          </div>

          {loading ? (
            <p style={{ textAlign: "center", marginTop: 20 }}>
              Загрузка блюд...
            </p>
          ) : list.length === 0 ? (
            <p style={{ textAlign: "center", marginTop: 20 }}>
              🍽️ В этом ресторане пока нет блюд
            </p>
          ) : (
            list.map((item, index) => (
              <div key={index} className="cart-items-title2 my-orders-order">
                <div className="logo_wrapper">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="shop_logo__wrapper"
                  />
                </div>
                <p className="cart_item__txt">{item.name}</p>
                <p className="cart_item__txt">{item.description}</p>
                <p className="cart_item__txt">{item.price} ₽</p>
                <p onClick={() => removeProduct(item._id)} className="cursor">
                  <img
                    className="cart_item__img"
                    src={assets.trash_icon}
                    alt="Удалить"
                  />
                </p>
                <Link to={`/edit-food/${item._id}`} className="cursor">
                  <img
                    className="cart_item__img"
                    src={assets.edit_button_icon}
                    alt="Изменить"
                  />
                </Link>
              </div>
            ))
          )}
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

export default FoodList;
