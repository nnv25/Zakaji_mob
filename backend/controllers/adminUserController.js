import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AdminUser from "../models/adminUserModel.js";
import Restaurant from "../models/restaurantModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; // Добавь в .env для безопасности

// ✅ Добавить нового администратора / менеджера / официанта
export const addAdminUser = async (req, res) => {
  try {
    const {
      lastName,
      firstName,
      patronymic,
      username,
      password,
      phone,
      role,
      restaurantId,
    } = req.body;

    if (!lastName || !firstName || !username || !password || !role || !restaurantId) {
      return res.status(400).json({ message: "Заполните все обязательные поля" });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Ресторан не найден" });
    }

    const existing = await AdminUser.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: "Такой логин уже существует" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await AdminUser.create({
      lastName,
      firstName,
      patronymic,
      username,
      password: hashedPassword,
      phone,
      role,
      restaurant: restaurantId,
    });

    res.status(201).json({ message: "Пользователь успешно добавлен", admin });
  } catch (error) {
    console.error("Ошибка при добавлении пользователя:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// ✅ Получить всех админ-пользователей
export const getAllAdminUsers = async (req, res) => {
  try {
    const users = await AdminUser.find()
      .populate("restaurant", "name address phone")
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    console.error("Ошибка получения админов:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// ✅ Получить админов конкретного ресторана
export const getAdminsByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const users = await AdminUser.find({ restaurant: restaurantId }).populate(
      "restaurant",
      "name"
    );

    res.status(200).json(users);
  } catch (error) {
    console.error("Ошибка получения пользователей ресторана:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// ✅ Удалить администратора
export const deleteAdminUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await AdminUser.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    res.status(200).json({ message: "Пользователь удалён" });
  } catch (error) {
    console.error("Ошибка удаления пользователя:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// ✅ Логин администратора
export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ message: "Введите логин и пароль" });

    const user = await AdminUser.findOne({ username }).populate("restaurant", "name");
    if (!user) return res.status(404).json({ message: "Пользователь не найден" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Неверный пароль" });

    const token = jwt.sign(
      { id: user._id, role: user.role, restaurant: user.restaurant?._id },
      JWT_SECRET,
      { expiresIn: "12h" }
    );

    res.status(200).json({
      message: "Успешный вход",
      token,
      user: {
        id: user._id,
        role: user.role,
        restaurant: user.restaurant,
        name: `${user.firstName} ${user.lastName}`,
      },
    });
  } catch (error) {
    console.error("Ошибка входа:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// ✅ Проверка токена (для автоавторизации)
export const checkAuth = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "Нет токена авторизации" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await AdminUser.findById(decoded.id).populate("restaurant", "name");

    if (!user) return res.status(401).json({ message: "Пользователь не найден" });

    res.status(200).json({
      id: user._id,
      role: user.role,
      restaurant: user.restaurant,
      name: `${user.firstName} ${user.lastName}`,
    });
  } catch (error) {
    console.error("Ошибка авторизации:", error);
    res.status(401).json({ message: "Недействительный токен" });
  }
};
