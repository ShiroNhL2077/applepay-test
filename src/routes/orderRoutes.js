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
import mongoose from "mongoose";
import { protect, restrictToAdmin } from "../middlewares/authMiddleware.js";
import OrderTicketAssociation from "../models/orderTicketAssociation.js";
import Order from "../models/Order.js";

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
orderRouter.get("/all-tick", getAllTick); // Requires user authentication

// Define a route to delete all data in OrderTicketAssociation and Order
orderRouter.delete("/deleteAllData", async (req, res) => {
  try {
    // Start a new session
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Delete all documents in OrderTicketAssociation collection
      await OrderTicketAssociation.deleteMany({}, { session });

      // Delete all documents in Order collection
      await Order.deleteMany({}, { session });

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({ message: "All data deleted successfully" });
    } catch (error) {
      // Rollback the transaction if an error occurs
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Error deleting data: ${error.message}` });
  }
});

export default orderRouter;
