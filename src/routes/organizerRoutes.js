import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
const OrganizerRouter = express.Router();

// Protected route example for organizers (requires authentication)
OrganizerRouter.get("/organizer-portal", protect, (req, res) => {
  if (req.role === "organizer") {
    return res.status(200).json({ message: "Welcome to the Organizer Portal" });
  } else {
    return res.status(403).json({ message: "Access denied" });
  }
});



// Other organizer-specific routes can be added here


export default OrganizerRouter;
