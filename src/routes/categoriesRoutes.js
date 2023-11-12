import express from "express";
import {
  addCategory,
  updateCategory,
  getAllCategories,
  getCategoryById,
  safeDeleteCategory,
} from "../controllers/categoriesController.js"; // Adjust the path as needed

// Import middleware for role-based access control
import { restrictToAdmin } from "../middlewares/authMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";

const categoriesRouter = express.Router();

// Define category routes
categoriesRouter.post("/add", protect, restrictToAdmin, addCategory);
categoriesRouter.put("/:id", protect, restrictToAdmin, updateCategory);
categoriesRouter.get("/", getAllCategories);
categoriesRouter.get("/:id", getCategoryById);
categoriesRouter.put(
  "/delete/:id",
  protect,
  restrictToAdmin,
  safeDeleteCategory
);

export default categoriesRouter;
