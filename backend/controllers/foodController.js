import mongoose from "mongoose";
import foodModel from "../models/foodModel.js";
import restaurantModel from "../models/restaurantModel.js";
import categoryModel from "../models/categoryModel.js"; // ✅ добавлено

// ✅ Добавить блюдо
const addFood = async (req, res) => {
  try {
    const { name, description, weight, price, restaurantId, category } =
      req.body;

    if (
      !name ||
      !description ||
      !weight ||
      !price ||
      !restaurantId ||
      !category
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Все поля обязательны" });
    }

    const restaurant = await restaurantModel.findById(restaurantId);
    if (!restaurant)
      return res
        .status(404)
        .json({ success: false, message: "Ресторан не найден" });

    // ✅ Проверяем категорию
    let categoryId = category;
    if (!mongoose.isValidObjectId(category)) {
      const found = await categoryModel.findOne({
        name: category,
        restaurant: restaurantId,
      });
      if (!found)
        return res
          .status(400)
          .json({ success: false, message: "Категория не найдена" });
      categoryId = found._id;
    }

    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "Изображение обязательно" });

    const food = new foodModel({
      name,
      description,
      weight,
      price,
      image: req.file.filename,
      category: categoryId,
      restaurant: restaurantId,
    });

    await food.save();
    res.json({ success: true, message: "Блюдо успешно добавлено" });
  } catch (error) {
    console.error("Ошибка при добавлении блюда:", error);
    res.status(500).json({ success: false, message: "Ошибка на сервере" });
  }
};

// ✅ Обновить блюдо
const updateFood = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, weight, price, category } = req.body;

    const food = await foodModel.findById(id);
    if (!food)
      return res
        .status(404)
        .json({ success: false, message: "Блюдо не найдено" });

    // ✅ Проверяем категорию
    let categoryId = category;
    if (!mongoose.isValidObjectId(category)) {
      const found = await categoryModel.findOne({
        name: category,
        restaurant: food.restaurant,
      });
      if (!found)
        return res
          .status(400)
          .json({ success: false, message: "Категория не найдена" });
      categoryId = found._id;
    }

    food.name = name || food.name;
    food.description = description || food.description;
    food.weight = weight || food.weight;
    food.price = price || food.price;
    food.category = categoryId;
    if (req.file) food.image = req.file.filename;

    await food.save();
    res.json({ success: true, message: "Блюдо успешно обновлено" });
  } catch (error) {
    console.error("Ошибка при обновлении блюда:", error);
    res.status(500).json({ success: false, message: "Ошибка на сервере" });
  }
};

// ✅ Получить блюда
const getFoods = async (req, res) => {
  try {
    const { restaurantId, category } = req.query;
    const filter = {};

    if (restaurantId) filter.restaurant = restaurantId;

    if (category && category !== "Все") {
      // Если передано название категории — ищем её ID
      const found = await categoryModel.findOne({
        name: category,
        restaurant: restaurantId,
      });
      if (found) filter.category = found._id;
    }

    const foods = await foodModel
      .find(filter)
      .populate("restaurant", "name")
      .populate("category", "name")
      .sort({ createdAt: -1 });

    const formatted = foods.map((f) => ({
      _id: f._id,
      name: f.name,
      description: f.description,
      weight: f.weight,
      price: f.price,
      category: f.category?.name || "—",
      image: `https://${req.headers.host}/uploadsFood/${f.image}`,
      restaurant: f.restaurant?.name || "—",
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Ошибка при получении блюд:", error);
    res.status(500).json({ message: "Ошибка при загрузке блюд" });
  }
};

// ✅ Удалить блюдо
const deleteFood = async (req, res) => {
  try {
    const { id } = req.params;
    const food = await foodModel.findById(id);
    if (!food)
      return res
        .status(404)
        .json({ success: false, message: "Блюдо не найдено" });

    await food.deleteOne();
    res.json({ success: true, message: "Блюдо успешно удалено" });
  } catch (error) {
    console.error("Ошибка при удалении блюда:", error);
    res.status(500).json({ success: false, message: "Ошибка на сервере" });
  }
};

export { addFood, getFoods, deleteFood, updateFood };
