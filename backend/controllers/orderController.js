import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Restaurant from "../models/restaurantModel.js";
import { io } from "../server.js";

// ✅ Создание нового заказа
export const createOrder = async (req, res) => {
  try {
    const { userId, restaurantId, items, tableNumber, comment, totalPrice } = req.body;

    if (!userId || !restaurantId || !items?.length || !tableNumber) {
      return res.status(400).json({ message: "Не хватает данных для оформления заказа" });
    }

    const user = await User.findById(userId);
    const restaurant = await Restaurant.findById(restaurantId);

    if (!user || !restaurant) {
      return res.status(404).json({ message: "Пользователь или ресторан не найден" });
    }

    const order = await Order.create({
      user: userId,
      restaurant: restaurantId,
      items,
      tableNumber: String(tableNumber),
      comment,
      totalPrice,
    });

    // 🔥 отправляем событие ВСЕМ клиентам
    io.emit("newOrder", order);

    res.status(201).json({ message: "Заказ успешно оформлен", order });
  } catch (error) {
    console.error("Ошибка создания заказа:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// ✅ История заказов пользователя (с полными URL картинок)
// ✅ История заказов пользователя (с полными URL картинок)
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ user: userId })
      .populate("restaurant", "name image")
      .sort({ createdAt: -1 })
      .lean();

    const formattedOrders = orders.map((order) => ({
      ...order,
      restaurant: {
        ...order.restaurant,
        image: order.restaurant?.image
          ? `http://${req.headers.host}/uploads/${order.restaurant.image}`
          : `http://${req.headers.host}/uploads/no_logo.png`,
      },
      items: order.items.map((item) => ({
        ...item,
        image: item.image
          ? // 👇 используем uploadsFood для блюд
            `http://${req.headers.host}/uploadsFood/${item.image}`
          : `http://${req.headers.host}/uploads/no_image.png`,
      })),
    }));

    res.status(200).json(formattedOrders);
  } catch (error) {
    console.error("Ошибка получения истории:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// ✅ Заказы конкретного ресторана
export const getRestaurantOrders = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const orders = await Order.find({ restaurant: restaurantId })
      .populate("user", "name phone")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Ошибка получения заказов ресторана:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// ✅ Удаление заказа
export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const deleted = await Order.findByIdAndDelete(orderId);
    if (!deleted) return res.status(404).json({ message: "Заказ не найден" });

    res.status(200).json({ message: "Заказ удалён" });
  } catch (error) {
    console.error("Ошибка удаления заказа:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// ✅ Обновление статуса (активация/деактивация)
export const toggleOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Заказ не найден" });
    }

    order.active = !order.active;
    await order.save();

    res.status(200).json({ message: "Статус заказа обновлён", active: order.active });
  } catch (error) {
    console.error("Ошибка изменения статуса заказа:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

