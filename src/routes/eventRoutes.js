import express from "express";
import {
  createEvent,
  deleteEvent,
  getEventById,
  getEvents,
  getEventsByOrganizer,
  publishSavedDraftEvent,
  updateEvent,
  getDraftsEvents,
  getEventsVisibleWithAccessCode,
  getActivePublicEvents,
  getActiveHiddenEvents,
} from "../controllers/eventController.js";
// Imported event controller functions

// Import middleware for role-based access control
import { restrictToAdmin } from "../middlewares/authMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";

const eventRouter = express.Router();

// Route for creating a new event
eventRouter.post("/add", protect, restrictToAdmin, createEvent);

// Route for getting all events
eventRouter.get("/", getEvents);

// Route for getting an event by ID
eventRouter.get("/:id", getEventById);

// Route for updating an event by ID
eventRouter.put("/:id", protect, restrictToAdmin, updateEvent);

// Route for deleting an event by ID
eventRouter.delete("/:id", protect, restrictToAdmin, deleteEvent);

// Define the route for getting events by organizer
eventRouter.get("/organizer/:organizerId/events", getEventsByOrganizer);

// Publish a saved draft event
eventRouter.put(
  "/publish/:eventId",
  protect,
  restrictToAdmin,
  publishSavedDraftEvent
);

// Get saved draft events
eventRouter.get("/drafts/get-all", protect, restrictToAdmin, getDraftsEvents);

//Get events with access code
eventRouter.get(
  "/published/visible-with-code-events/:accessCode",
  getEventsVisibleWithAccessCode
);

//Get active public events
eventRouter.get("/published/active-public-events", getActivePublicEvents);

//Get active hidden events
eventRouter.get("/published/active-hidden-events", getActiveHiddenEvents);

export default eventRouter;
