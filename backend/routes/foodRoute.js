import express from "express";
import multer from "multer";
import {
  addFood,
  getFoods,
  deleteFood,
  updateFood,
} from "../controllers/foodController.js";

const foodRouter = express.Router();

const storage = multer.diskStorage({
  destination: "uploadsFood",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

// ✅ Добавить блюдо
foodRouter.post("/add", upload.single("image"), addFood);

// ✅ Получить блюда
foodRouter.get("/all", getFoods);

// ✅ Удалить блюдо
foodRouter.delete("/:id", deleteFood);

// ✅ Обновить блюдо
foodRouter.put("/update/:id", upload.single("image"), updateFood);

export default foodRouter;
