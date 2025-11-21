import express from "express";
import {
  createOrder,
  getUserOrders,
  getRestaurantOrders,
  deleteOrder,
  toggleOrderStatus,
} from "../controllers/orderController.js";

const router = express.Router();

// создать заказ
router.post("/create", createOrder);

// история заказов пользователя
router.get("/user/:userId", getUserOrders);

// заказы конкретного ресторана (для админки)
router.get("/restaurant/:restaurantId", getRestaurantOrders);

// удалить заказ
router.delete("/:orderId", deleteOrder);

router.patch("/:orderId/toggle", toggleOrderStatus);

export default router;
