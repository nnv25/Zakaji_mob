import express from "express";
import {
  addAdminUser,
  getAllAdminUsers,
  getAdminsByRestaurant,
  deleteAdminUser,
  loginAdmin,
  checkAuth,
} from "../controllers/adminUserController.js";

const router = express.Router();

// CRUD пользователей
router.post("/add", addAdminUser);
router.get("/all", getAllAdminUsers);
router.get("/restaurant/:restaurantId", getAdminsByRestaurant);
router.delete("/:id", deleteAdminUser);

// Авторизация
router.post("/login", loginAdmin);
router.get("/check", checkAuth);

export default router;
