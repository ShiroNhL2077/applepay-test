import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
const BuyerRouter = express.Router();

// Protected route example for buyers (requires authentication)
BuyerRouter.get("/buyer-portal", protect, (req, res) => {
  if (req.role === "buyer") {
    return res.status(200).json({ message: "Welcome to the Buyer Portal" });
  } else {
    return res.status(403).json({ message: "Access denied" });
  }
});

// Other buyer-specific routes can be added here

export default BuyerRouter;
