import express from "express";
import {
  registerUser,
  getUserByPhone,
  deleteUser,
  updatePushToken,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.get("/find", getUserByPhone);

// ❗ DELETE /api/users/:id
router.delete("/:id", deleteUser);
router.post("/push-token", updatePushToken);

export default router;
