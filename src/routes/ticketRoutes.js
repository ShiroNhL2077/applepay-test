import express from "express";
import {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  getTicketsByOrganizer,
} from "../controllers/ticketController.js"; // Import controller functions


// Import middleware for role-based access control
import { restrictToAdmin } from "../middlewares/authMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";

const ticketRouter = express.Router();

// Route for creating a new ticket
ticketRouter.post("/add", protect, restrictToAdmin, createTicket);
// Route for getting all tickets
ticketRouter.get("/", getTickets);
// Route for getting a single ticket by ID
ticketRouter.get("/:id", getTicketById);
// Route for updating a ticket by ID
ticketRouter.put("/:id", protect, restrictToAdmin, updateTicket);
// Route for deleting a ticket by ID
ticketRouter.delete("/:id", protect, restrictToAdmin, deleteTicket);
// Route for fetching all tickets for organizer
ticketRouter.get("/organizer/:organizerId", getTicketsByOrganizer);


export default ticketRouter;
