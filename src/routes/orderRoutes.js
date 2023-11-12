import express from "express";
import {
  createOrderWithPayPal,
  createOrderWithStripe,
  createPaymentIntent,
  getAllOrders,
  getAllOrdersForEvent,
  getAllOrdersForUser,
  getAllTick,
  getOrderById,
} from "../controllers/orderController.js";

import { protect, restrictToAdmin } from "../middlewares/authMiddleware.js";

const orderRouter = express.Router();

orderRouter.post("/stripe/createIntent", createPaymentIntent);
// Create order with Stripe when not logged-in
orderRouter.post("/stripe/create", protect, createOrderWithStripe);

//Create an order with Stripe when logged-in
orderRouter.post("/stripe/guest/create", createOrderWithStripe);

// Create order with Paypal when not logged-in
orderRouter.post("/paypal/create", protect, createOrderWithPayPal);

//Create an order with Paypal when logged-in
orderRouter.post("/paypal/guest/create", createOrderWithPayPal);

// get all orders for an event
orderRouter.get(
  "/event/:eventId",
  protect,
  restrictToAdmin,
  getAllOrdersForEvent
);
//Get all orders
orderRouter.get("/all", protect, restrictToAdmin, getAllOrders);
//orderRouter.get("/all-tick",  getAllTick);
//Get a single Order by ID
orderRouter.get("/one-order/:orderId", protect, restrictToAdmin, getOrderById);
//Get events for a user
orderRouter.get("/user", protect, getAllOrdersForUser); // Requires user authentication

export default orderRouter;
