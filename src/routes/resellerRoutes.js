import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
const ResellerRouter = express.Router();

// Protected route example for organizers (requires authentication)
ResellerRouter.get("/reseller-portal", protect, (req, res) => {
  if (req.role === "reseller") {
    return res.status(200).json({ message: "Welcome to the Reseller Portal" });
  } else {
    return res.status(403).json({ message: "Access denied" });
  }
});

// Other organizer-specific routes can be added here

export default ResellerRouter;
