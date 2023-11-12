import express from "express";
import { protect } from "../middlewares/authMiddleware.js";


const SecurityAgentsRouter = express.Router();

// Protected route example for organizers (requires authentication)
SecurityAgentsRouter.get("/event-staff-portal", protect, (req, res) => {
  if (req.role === "securityAgent") {
    return res
      .status(200)
      .json({ message: "Welcome to the Security Agent Portal" });
  } else {
    return res.status(403).json({ message: "Access denied" });
  }
});
// Other organizer-specific routes can be added here

export default SecurityAgentsRouter;
