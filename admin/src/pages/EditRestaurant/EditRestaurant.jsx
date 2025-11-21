import React, { useEffect, useState, useContext } from "react";
import "./EditRestaurant.css"; // те же стили
import { assets } from "../../assets/assets";
import { ShopContext } from "../../context/ShopContext";
import { toast } from "react-toastify"; // 👈 импортируем Toastify

const EditRestaurant = () => {
  const { selectedShop } = useContext(ShopContext); // выбранный ресторан из Navbar
  const [restaurantData, setRestaurantData] = useState({
    name: "",
    weekdays: "",
    saturday: "",
    sunday: "",
    address: "",
    phone: "",
    delivery: "false",
  });
  const [image, setImage] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const [currentImage, setCurrentImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Загружаем данные ресторана при выборе
  useEffect(() => {
    if (!selectedShop) return;

    const fetchRestaurant = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${API_URL}/api/restaurant/${selectedShop}`
        );
        const data = await res.json();

        setRestaurantData({
          name: data.name,
          weekdays: data.worktime.weekdays,
          saturday: data.worktime.saturday,
          sunday: data.worktime.sunday,
          address: data.address,
          phone: data.phone,
          delivery: data.delivery ? "true" : "false",
        });
        setCurrentImage(data.image);
      } catch (error) {
        console.error("Ошибка при загрузке ресторана:", error);
        toast.error("❌ Ошибка при загрузке данных ресторана");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [selectedShop]);

  // ✅ Форматирование телефона
  const formatPhone = (raw) => {
    const digits = raw.replace(/\D/g, "");
    let formatted = "+7";
    if (digits.length > 1) formatted += "(" + digits.slice(1, 4);
    if (digits.length >= 4) formatted += ")";
    if (digits.length >= 5) formatted += digits.slice(4, 7);
    if (digits.length >= 7) formatted += "-" + digits.slice(7, 9);
    if (digits.length >= 9) formatted += "-" + digits.slice(9, 11);
    return formatted;
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setRestaurantData((prev) => ({ ...prev, phone: formatPhone(value) }));
  };

  // ✅ Отправка изменений
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedShop) {
      toast.warning("⚠️ Выберите ресторан в навбаре!");
      return;
    }

    const formData = new FormData();
    Object.entries(restaurantData).forEach(([key, value]) =>
      formData.append(key, value)
    );
    if (image) formData.append("image", image);

    try {
      setLoading(true);
      const res = await fetch(
        `${API_URL}/api/restaurant/update/${selectedShop}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success("✅ Данные ресторана успешно обновлены!");
      } else {
        toast.error(`⚠️ ${data.message || "Ошибка при обновлении ресторана"}`);
      }
    } catch (error) {
      console.error("Ошибка при обновлении ресторана:", error);
      toast.error("❌ Ошибка при обновлении данных. Проверьте сервер!");
    } finally {
      setLoading(false);
    }
  };

  if (!selectedShop) {
    return (
      <div className="add">
        <h3 className="item-h2">Редактирование ресторана</h3>
        <hr className="shop-info-divider" />
        <p className="shop-title">
          ⚠️ Пожалуйста, выберите ресторан в навбаре для редактирования.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="add">
        <p>Загрузка данных ресторана...</p>
      </div>
    );
  }

  return (
    <div className="add">
      <div className="h2-item">
        <h3 className="item-h2">РЕДАКТИРОВАТЬ РЕСТОРАН</h3>
      </div>
      <hr className="shop-info-divider" />

      <form className="flex-col" onSubmit={handleSubmit}>
        {/* Название */}
        <div className="add-shop-name">
          <p className="shop-title">Название ресторана</p>
          <input
            type="text"
            value={restaurantData.name}
            onChange={(e) =>
              setRestaurantData({ ...restaurantData, name: e.target.value })
            }
            className="addshop-input"
            required
          />
        </div>

        {/* Часы работы */}
        <div className="add-shop-worktime">
          <p className="shop-title">Часы работы</p>
          <div className="shop-worktime">
            <div className="addshop-container">
              <p className="shop-title-time">Пн–Пт</p>
              <input
                value={restaurantData.weekdays}
                onChange={(e) =>
                  setRestaurantData({
                    ...restaurantData,
                    weekdays: e.target.value,
                  })
                }
                className="addshop-input"
                required
              />
            </div>
            <div className="addshop-container">
              <p className="shop-title-time">Суб</p>
              <input
                value={restaurantData.saturday}
                onChange={(e) =>
                  setRestaurantData({
                    ...restaurantData,
                    saturday: e.target.value,
                  })
                }
                className="addshop-input"
                required
              />
            </div>
            <div className="addshop-container">
              <p className="shop-title-time">Вск</p>
              <input
                value={restaurantData.sunday}
                onChange={(e) =>
                  setRestaurantData({
                    ...restaurantData,
                    sunday: e.target.value,
                  })
                }
                className="addshop-input"
                required
              />
            </div>
          </div>
        </div>

        {/* Адрес */}
        <div className="add-shop-address">
          <p className="shop-title">Адрес</p>
          <input
            type="text"
            value={restaurantData.address}
            onChange={(e) =>
              setRestaurantData({ ...restaurantData, address: e.target.value })
            }
            className="addshop-input"
            required
          />
        </div>

        {/* Телефон */}
        <div className="add-shop-phone">
          <p className="shop-title">Телефон</p>
          <input
            type="tel"
            value={restaurantData.phone}
            onChange={handlePhoneChange}
            className="addshop-input"
            required
          />
        </div>

        {/* Доставка */}
        <div className="add-shop-delivery">
          <p className="shop-title">Доставка:</p>
          <select
            value={restaurantData.delivery}
            onChange={(e) =>
              setRestaurantData({
                ...restaurantData,
                delivery: e.target.value,
              })
            }
            className="addshop-input"
          >
            <option value="false">Нет</option>
            <option value="true">Да</option>
          </select>
        </div>

        {/* Фото */}
        <div className="add-img-upload flex-col">
          <p className="shop-title">Изменить логотип</p>
          <label htmlFor="image">
            <img
              src={
                image
                  ? URL.createObjectURL(image)
                  : currentImage || assets.shop_logo_load
              }
              alt="Restaurant logo"
            />
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <button type="submit" className="add-btn" disabled={loading}>
          {loading ? "Сохранение..." : "Сохранить изменения"}
        </button>
      </form>
    </div>
  );
};

export default EditRestaurant;
