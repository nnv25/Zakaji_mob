import React, { useContext, useState, useEffect } from "react";
import { assets } from "../../assets/assets";
import "./AddFood.css";
import { ShopContext } from "../../context/ShopContext";
import { toast } from "react-toastify"; // 👈 импортируем Toastify

const AddFood = () => {
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const { selectedShop } = useContext(ShopContext);
  const [shopName, setShopName] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;

  // Загружаем название ресторана по ID
  useEffect(() => {
    const fetchShopName = async () => {
      if (selectedShop) {
        try {
          const res = await fetch(
            `${API_URL}/api/restaurant/${selectedShop}`
          );
          const shop = await res.json();
          setShopName(shop.name || "Не найден");
        } catch (error) {
          console.error("Ошибка при загрузке ресторана:", error);
        }
      } else {
        setShopName("");
      }
    };

    fetchShopName();
  }, [selectedShop]);

  useEffect(() => {
    if (!selectedShop) return;
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/category/${selectedShop}`
        );
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Ошибка категорий:", error);
      }
    };
    fetchCategories();
  }, [selectedShop]);

  // Обработка выбора файла
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImage(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setImage(null);
    setImageFile(null);
  };

  // ✅ Отправка формы
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedShop) {
      toast.warning("Выберите ресторан в навбаре!");
      return;
    }

    const form = e.target;
    const formData = new FormData();

    formData.append("name", form.name.value);
    formData.append("description", form.description.value);
    formData.append("weight", form.weight.value);
    formData.append("price", form.price.value);
    formData.append("restaurantId", selectedShop);
    formData.append("category", form.category.value);
    formData.append("image", imageFile);

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/food/add`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        toast.success("✅ Блюдо успешно добавлено!");
        form.reset();
        setImage(null);
        setImageFile(null);
      } else {
        toast.error(`⚠️ ${data.message || "Ошибка при добавлении блюда"}`);
      }
    } catch (error) {
      console.error("Ошибка при добавлении блюда:", error);
      toast.error("❌ Ошибка при добавлении блюда. Проверьте сервер!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add">
      <div className="h2-item">
        <h3 className="item-h2">ДОБАВИТЬ БЛЮДО</h3>
      </div>
      <hr className="shop-info-divider" />

      <form className="flex-col" onSubmit={handleSubmit}>
        {/* Название */}
        <div className="add-shop-name">
          <p className="shop-title">Наименование блюда</p>
          <input
            className="addshop-input"
            maxLength="80"
            type="text"
            name="name"
            placeholder="Введите название блюда"
            required
          />
        </div>

        {/* Описание */}
        <div className="add-shop-name">
          <p className="shop-title">Описание блюда</p>
          <textarea
            className="addshop-input"
            maxLength="200"
            name="description"
            rows="6"
            placeholder="Введите описание блюда"
            required
          ></textarea>
        </div>

        {/* Вес */}
        <div className="add-shop-name">
          <p className="shop-title">Вес блюда</p>
          <div className="food-weight">
            <input
              className="addshop-input"
              type="number"
              name="weight"
              placeholder="Введите вес"
              required
            />
            <p className="shop-title">грамм</p>
          </div>
        </div>

        {/* Ресторан */}
        <div className="add-shop-name">
          <div className="add-category flex-col">
            <p className="shop-title">Наименование ресторана</p>
            <p className="add-text">
              {shopName ? shopName : "Выберите ресторан в навбаре"}
            </p>
          </div>
        </div>

        {/* Цена */}
        <div className="add-shop-name">
          <p className="shop-title">Цена товара</p>
          <input
            className="addshop-input"
            type="number"
            name="price"
            placeholder="Введите цену товара"
            required
          />
        </div>
        {/* Категория блюда */}
        <div className="add-shop-name">
          <p className="shop-title">Категория блюда</p>
          <select
            className="addshop-input"
            name="category"
            required
            defaultValue=""
          >
            <option value="" disabled>
              Выберите категорию
            </option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Фото */}
        <div className="add-img-upload flex-col">
          <p className="shop-title">Добавить фото</p>
          <div className="image-preview-wrapper">
            <label htmlFor="image" className="image-label">
              <img
                src={image ? image : assets.shop_logo_load}
                alt="Выбранное фото"
                className="uploaded-image"
              />
              {image && (
                <span className="remove-image" onClick={handleRemoveImage}>
                  ×
                </span>
              )}
            </label>
            <input
              type="file"
              id="image"
              hidden
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <button type="submit" className="add-btn" disabled={loading}>
          {loading ? "Добавление..." : "ДОБАВИТЬ БЛЮДО"}
        </button>
      </form>
    </div>
  );
};

export default AddFood;
