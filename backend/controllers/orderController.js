import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Restaurant from "../models/restaurantModel.js";
import { io } from "../server.js";

/* ---------------------------------------------------------
   🔥 ФУНКЦИЯ ОТПРАВКИ PUSH УВЕДОМЛЕНИЯ ЧЕРЕЗ EXPO
--------------------------------------------------------- */
async function sendPush(token, title, body, data = {}) {
  try {
    if (!token) return;

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: token,
        sound: "default",
        title,
        body,
        data,
      }),
    });

    console.log("📨 PUSH отправлен:", token);
  } catch (err) {
    console.error("❌ Ошибка отправки PUSH:", err);
  }
}

/* ---------------------------------------------------------
    🟢 СОЗДАНИЕ ЗАКАЗА
--------------------------------------------------------- */
export const createOrder = async (req, res) => {
  try {
    const { userId, restaurantId, items, tableNumber, comment, totalPrice } =
      req.body;

    if (!userId || !restaurantId || !items?.length || !tableNumber) {
      return res
        .status(400)
        .json({ message: "Не хватает данных для оформления заказа" });
    }

    const user = await User.findById(userId);
    const restaurant = await Restaurant.findById(restaurantId);

    if (!user || !restaurant) {
      return res
        .status(404)
        .json({ message: "Пользователь или ресторан не найден" });
    }

    const order = await Order.create({
      user: userId,
      restaurant: restaurantId,
      items,
      tableNumber: String(tableNumber),
      comment,
      totalPrice,
    });

    // 🔥 Уведомить админку (websocket)
    io.emit("newOrder", order);

    /* ---------------------------------------------
       🔥 SEND PUSH TO USER (если есть токен)
    ----------------------------------------------*/
    if (user.expoPushToken) {
      await sendPush(
        user.expoPushToken,
        "Ваш заказ успешно оформлен!",
        `Ваш заказ №${order._id} принят в работу.`,
        { orderId: order._id } // для навигации по клику
      );
    }

    res.status(201).json({ message: "Заказ успешно оформлен", order });
  } catch (error) {
    console.error("Ошибка создания заказа:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

/* ---------------------------------------------------------
    📌 ИСТОРИЯ ЗАКАЗОВ ПОЛЬЗОВАТЕЛЯ
--------------------------------------------------------- */
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
          ? `http://${req.headers.host}/uploadsFood/${item.image}`
          : `http://${req.headers.host}/uploads/no_image.png`,
      })),
    }));

    res.status(200).json(formattedOrders);
  } catch (error) {
    console.error("Ошибка получения истории:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

/* ---------------------------------------------------------
    📌 СПИСОК ЗАКАЗОВ РЕСТОРАНА (для админки)
--------------------------------------------------------- */
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

/* ---------------------------------------------------------
    ❌ УДАЛЕНИЕ ЗАКАЗА
--------------------------------------------------------- */
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

/* ---------------------------------------------------------
    🔄 ПЕРЕКЛЮЧЕНИЕ СТАТУСА ЗАКАЗА
--------------------------------------------------------- */
export const toggleOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Заказ не найден" });
    }

    order.active = !order.active;
    await order.save();

    res.status(200).json({
      message: "Статус заказа обновлён",
      active: order.active,
    });
  } catch (error) {
    console.error("Ошибка изменения статуса заказа:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};
