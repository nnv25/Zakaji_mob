import express from "express";
import multer from "multer";
import {
  addRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  toggleBanRestaurant,
} from "../controllers/restaurantController.js";

const restaurantRouter = express.Router();

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`),
});

const upload = multer({ storage });

restaurantRouter.post("/add", upload.single("image"), addRestaurant);
restaurantRouter.get("/all", getAllRestaurants);
restaurantRouter.get("/:id", getRestaurantById);
restaurantRouter.put("/update/:id", upload.single("image"), updateRestaurant);
restaurantRouter.delete("/:id", deleteRestaurant);
restaurantRouter.patch("/ban/:id", toggleBanRestaurant);

export default restaurantRouter;

