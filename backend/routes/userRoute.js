import express from "express";
import {
  registerUser,
  getUserByPhone,
  deleteUser
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.get("/find", getUserByPhone);

// ❗ DELETE /api/users/:id
router.delete("/:id", deleteUser);

export default router;
