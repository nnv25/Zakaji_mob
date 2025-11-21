import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import "./EditFood.css";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import { ShopContext } from "../../context/ShopContext"; // ✅ добавляем импорт контекста

const EditFood = () => {
  const { id } = useParams();
  const { selectedShop } = useContext(ShopContext); // ✅ теперь selectedShop определён
  const API_URL = import.meta.env.VITE_API_URL;

  const [foodData, setFoodData] = useState({
    name: "",
    description: "",
    weight: "",
    price: "",
    category: "",
  });
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  // ✅ Загружаем данные блюда
  useEffect(() => {
    const fetchFood = async () => {
      try {
        const res = await fetch(`${API_URL}/api/food/all`);
        const data = await res.json();
        const found = data.find((f) => f._id === id);
        if (!found) {
          toast.error("❌ Блюдо не найдено");
          return;
        }

        setFoodData({
          name: found.name,
          description: found.description,
          weight: found.weight,
          price: found.price,
          category: found.category,
        });
        setCurrentImage(found.image);
      } catch (error) {
        console.error("Ошибка при загрузке блюда:", error);
        toast.error("Ошибка при загрузке данных блюда");
      }
    };

    fetchFood();
  }, [id]);

  // ✅ Загружаем категории для выбранного ресторана
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

  // ✅ Обработка выбора изображения
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

  // ✅ Сохранение изменений
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", foodData.name);
    formData.append("description", foodData.description);
    formData.append("weight", foodData.weight);
    formData.append("price", foodData.price);
    formData.append("category", foodData.category);
    if (imageFile) formData.append("image", imageFile);

    try {
      setLoading(true);
      const res = await fetch(
        `${API_URL}/api/food/update/${id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const data = await res.json();
      if (data.success) {
        toast.success("✅ Блюдо успешно обновлено!");
      } else {
        toast.error(`⚠️ ${data.message || "Ошибка при обновлении блюда"}`);
      }
    } catch (error) {
      console.error("Ошибка при обновлении блюда:", error);
      toast.error("❌ Ошибка при обновлении блюда. Проверьте сервер!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add">
      <div className="h2-item">
        <h3 className="item-h2">РЕДАКТИРОВАНИЕ БЛЮДА</h3>
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
            value={foodData.name}
            onChange={(e) => setFoodData({ ...foodData, name: e.target.value })}
            required
          />
        </div>

        {/* Описание */}
        <div className="add-shop-name">
          <p className="shop-title">Описание блюда</p>
          <textarea
            className="addshop-input"
            maxLength="200"
            rows="6"
            value={foodData.description}
            onChange={(e) =>
              setFoodData({ ...foodData, description: e.target.value })
            }
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
              value={foodData.weight}
              onChange={(e) =>
                setFoodData({ ...foodData, weight: e.target.value })
              }
              required
            />
            <p className="shop-title">грамм</p>
          </div>
        </div>

        {/* Цена */}
        <div className="add-shop-name">
          <p className="shop-title">Цена товара</p>
          <input
            className="addshop-input"
            type="number"
            value={foodData.price}
            onChange={(e) =>
              setFoodData({ ...foodData, price: e.target.value })
            }
            required
          />
        </div>

        {/* Категория */}
        <div className="add-shop-name">
          <p className="shop-title">Категория блюда</p>
          <select
            className="addshop-input"
            name="category"
            value={foodData.category}
            onChange={(e) =>
              setFoodData({ ...foodData, category: e.target.value })
            }
            required
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
          <p className="shop-title">Изображение блюда</p>
          <div className="image-preview-wrapper">
            <label htmlFor="image" className="image-label">
              <img
                src={
                  image
                    ? image
                    : currentImage
                    ? currentImage
                    : assets.shop_logo_load
                }
                alt="Фото блюда"
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
          {loading ? "Сохранение..." : "СОХРАНИТЬ ИЗМЕНЕНИЯ"}
        </button>
      </form>
    </div>
  );
};

export default EditFood;
