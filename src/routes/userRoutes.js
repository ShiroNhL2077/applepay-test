import express from "express";
import { updateUserProfile } from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

// Define the route for updating the user profile
userRouter.put("/update-profile", protect, updateUserProfile);

export default userRouter;
