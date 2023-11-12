import express from "express";
import { registerOrganizer } from "../controllers/organizerController.js";

import { registerBuyer } from "../controllers/buyerController.js";
import {
  forgotPassword,
  resetPassword,
  verifyEmail,
} from "../controllers/authController.js";

import { protect } from "../middlewares/authMiddleware.js";

const authRoutes = express.Router();

// Route for user registration
authRoutes.post("/organizer-register", registerOrganizer);
// Route for buyer registration
authRoutes.post("/buyer-register", registerBuyer);
// Route for verifying the user's email
authRoutes.get("/verify/:token", verifyEmail);
// Route for password recovery
authRoutes.post("/forgot-password", forgotPassword);
// Route to allow users to reset their password
authRoutes.post("/reset-password/:token", resetPassword);
// Route for user information
authRoutes.get("/me", protect, (req, res) => {
  const user = req.user;
  // Define a user data object
  const userData = {
    id: user._id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    role: user.role,
  };

  return res.status(200).json(userData);
});
export default authRoutes;
