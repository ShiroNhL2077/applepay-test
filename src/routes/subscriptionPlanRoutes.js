import express from "express";
import {
  createSubscriptionPlan,
  getAllSubscriptionPlans,
  getSubscriptionPlanById,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
} from "../controllers/subscriptionPlanController.js";

// Import middleware for role-based access control
import { restrictToAdmin } from "../middlewares/authMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";

const subscriptionPlanRouter = express.Router();



// Define the CRUD routes for subscription plans
subscriptionPlanRouter.post(
  "/",
  protect,
  restrictToAdmin,
  createSubscriptionPlan
);
subscriptionPlanRouter.get(
  "/",
  protect,
  getAllSubscriptionPlans
);
subscriptionPlanRouter.get(
  "/:id",
  protect,
  getSubscriptionPlanById
);
subscriptionPlanRouter.put(
  "/:id",
  protect,
  restrictToAdmin,
  updateSubscriptionPlan
);
subscriptionPlanRouter.delete(
  "/:id",
  protect,
  restrictToAdmin,
  deleteSubscriptionPlan
);

export default subscriptionPlanRouter;
