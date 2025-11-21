import User from "../models/userModel.js";

// Регистрация или вход по номеру телефона
export const registerUser = async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: "Имя и телефон обязательны" });
    }

    // Проверяем, есть ли уже пользователь с таким номером
    let user = await User.findOne({ phone });

    if (user) {
      // Если пользователь уже есть — просто возвращаем его как "вход"
      return res.status(200).json({
        message: "Успешный вход",
        user,
        isLogin: true, // 👈 добавляем флаг
      });
    }

    // Иначе — создаём нового
    user = await User.create({ name, phone });

    return res.status(201).json({
      message: "Успешная регистрация",
      user,
      isLogin: false,
    });
  } catch (error) {
    console.error("Ошибка регистрации:", error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Получение пользователя по телефону (для автологина)
export const getUserByPhone = async (req, res) => {
  try {
    const { phone } = req.query;

    if (!phone) return res.status(400).json({ message: "Телефон обязателен" });

    const user = await User.findOne({ phone });
    if (!user)
      return res.status(404).json({ message: "Пользователь не найден" });

    res.status(200).json(user);
  } catch (error) {
    console.error("Ошибка при получении пользователя:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Удаление пользователя по ID
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    return res.status(200).json({ message: "Аккаунт удалён" });
  } catch (error) {
    console.error("Ошибка удаления пользователя:", error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
};
