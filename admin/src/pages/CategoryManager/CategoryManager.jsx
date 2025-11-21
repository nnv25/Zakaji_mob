import React, { useEffect, useState, useContext } from "react";
import "./CategoryManager.css";
import { toast } from "react-toastify";
import { ShopContext } from "../../context/ShopContext";
import { assets } from "../../assets/assets";

const CategoryManager = () => {
  const { selectedShop } = useContext(ShopContext);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  // ✅ Загрузка категорий
  const fetchCategories = async () => {
    if (!selectedShop) {
      setCategories([]);
      return toast.info("Выберите ресторан в навбаре!");
    }

    try {
      const res = await fetch(
        `${API_URL}/api/category/${selectedShop}`
      );
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Ошибка при загрузке категорий:", error);
      toast.error("Ошибка при загрузке категорий");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [selectedShop]);

  // ✅ Добавление категории
  const handleAdd = async () => {
    if (!newCategory.trim()) return toast.warning("Введите название категории");
    try {
      const res = await fetch(`${API_URL}/api/category/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCategory.trim(),
          restaurantId: selectedShop,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("✅ Категория добавлена");
        setNewCategory("");
        fetchCategories();
      } else toast.error(data.message || "Ошибка при добавлении");
    } catch (error) {
      toast.error("Ошибка при добавлении категории");
    }
  };

  // ✅ Удаление категории
  const handleDelete = async (id) => {
    if (!window.confirm("Удалить категорию?")) return;
    try {
      const res = await fetch(`${API_URL}/api/category/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("✅ Категория удалена");
        setCategories((prev) => prev.filter((c) => c._id !== id));
      } else toast.error("Ошибка при удалении");
    } catch (error) {
      toast.error("Ошибка при удалении");
    }
  };

  return (
    <div className="my-shops">
      <h2 className="my-shops-h2">КАТЕГОРИИ БЛЮД</h2>
      <hr className="shop-info-divider" />

      {!selectedShop ? (
        <p style={{ marginTop: 30 }}>🔍 Выберите ресторан в навбаре</p>
      ) : (
        <>
          <div className="category-add-block">
            <input
              type="text"
              placeholder="Введите название категории"
              className="addshop-input"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <button onClick={handleAdd} className="add-btn" disabled={loading}>
              Добавить
            </button>
          </div>

          <div className="cart-items">
            <div className="cart-items-title2">
              <p className="cart-items-name2">Название категории</p>
              <p className="cart-items-name2">Удалить</p>
            </div>
            <br />

            {categories.map((cat) => (
              <div key={cat._id} className="cart-items-title2 my-orders-order">
                <p className="cart_item__txt">{cat.name}</p>
                <p onClick={() => handleDelete(cat._id)} className="cursor">
                  <img
                    className="cart_item__img"
                    src={assets.trash_icon}
                    alt="Удалить"
                  />
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryManager;
