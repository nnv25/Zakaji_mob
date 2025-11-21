import express from "express";
import multer from "multer";
import path from "path";
import { uploadBanners, getBanners } from "../controllers/bannerController.js";

const router = express.Router();

// multer → сохраняем в uploadsBanner
const storage = multer.diskStorage({
  destination: "uploadsBanner",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

// 📤 Обновить все три баннера
router.post(
  "/upload",
  upload.fields([
    { name: "banner1", maxCount: 1 },
    { name: "banner2", maxCount: 1 },
    { name: "banner3", maxCount: 1 },
  ]),
  uploadBanners
);

// 📥 Получить баннеры
router.get("/all", getBanners);

export default router;