import categoryModel from "../models/categoryModel.js";
import restaurantModel from "../models/restaurantModel.js";

// ✅ Добавить категорию
const addCategory = async (req, res) => {
  try {
    const { name, restaurantId } = req.body;

    if (!name || !restaurantId)
      return res
        .status(400)
        .json({ success: false, message: "Название и ресторан обязательны" });

    const restaurant = await restaurantModel.findById(restaurantId);
    if (!restaurant)
      return res
        .status(404)
        .json({ success: false, message: "Ресторан не найден" });

    const existing = await categoryModel.findOne({
      name,
      restaurant: restaurantId,
    });
    if (existing)
      return res
        .status(400)
        .json({ success: false, message: "Такая категория уже существует" });

    const category = new categoryModel({ name, restaurant: restaurantId });
    await category.save();

    res.json({
      success: true,
      message: "Категория успешно добавлена",
      category,
    });
  } catch (error) {
    console.error("Ошибка при добавлении категории:", error);
    res.status(500).json({ success: false, message: "Ошибка сервера" });
  }
};

// ✅ Получить категории конкретного ресторана
const getCategoriesByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const categories = await categoryModel
      .find({ restaurant: restaurantId })
      .sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    console.error("Ошибка при получении категорий:", error);
    res.status(500).json({ success: false, message: "Ошибка сервера" });
  }
};

// ✅ Удалить категорию
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.findById(id);
    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Категория не найдена" });

    await category.deleteOne();
    res.json({ success: true, message: "Категория удалена" });
  } catch (error) {
    console.error("Ошибка при удалении категории:", error);
    res.status(500).json({ success: false, message: "Ошибка сервера" });
  }
};

// ✅ Обновить категорию
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const category = await categoryModel.findById(id);

    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Категория не найдена" });

    category.name = name || category.name;
    await category.save();
    res.json({ success: true, message: "Категория обновлена" });
  } catch (error) {
    console.error("Ошибка при обновлении категории:", error);
    res.status(500).json({ success: false, message: "Ошибка сервера" });
  }
};

export {
  addCategory,
  getCategoriesByRestaurant,
  deleteCategory,
  updateCategory,
};
