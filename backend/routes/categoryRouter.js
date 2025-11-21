import express from "express";
import {
  addCategory,
  getCategoriesByRestaurant,
  deleteCategory,
  updateCategory,
} from "../controllers/categoryController.js";

const categoryRouter = express.Router();

categoryRouter.post("/add", addCategory);
categoryRouter.get("/:restaurantId", getCategoriesByRestaurant);
categoryRouter.delete("/:id", deleteCategory);
categoryRouter.put("/update/:id", updateCategory);

export default categoryRouter;
