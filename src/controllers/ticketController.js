import Ticket from "../models/Tickets.js";
import cron from "node-cron";

// Create a new ticket
export const createTicket = async (req, res) => {
  try {
    // The logged-in user's ID is available in req.user
    const userId = req.user.id;
    const { linkedTicket, startDate, expireDate, quantity } = req.body;

    // Check if the provided linkedTicket ID is valid
    if (linkedTicket) {
      const existingLinkedTicket = await Ticket.findById(linkedTicket);

      if (!existingLinkedTicket) {
        return res
          .status(400)
          .json({ error: "The linked ticket does not exist." });
      }
    }

    // Check if startDate is before expireDate only when "On a specific date" is chosen
    if (
      startDate.option === "On a specific date" &&
      startDate.date &&
      expireDate.date
    ) {
      const startDateTime = new Date(startDate.date);
      const expireDateTime = new Date(expireDate.date);

      if (startDateTime >= expireDateTime) {
        return res
          .status(400)
          .json({ error: "startDate must be before expireDate." });
      }
    }

    // Create a new ticket and set the logged-in user as the organizer
    const ticket = new Ticket({
      ...req.body,
      organizer: userId,
      displayOptions: {
        remainingTickets: quantity, // Set remainingTickets to the same as quantity
      },
    });

    const savedTicket = await ticket.save();

    res.status(201).json(savedTicket);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};




// Get a list of all tickets
export const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find();
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single ticket by ID
export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }
    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTicketsByOrganizer = async (req, res) => {
  try {
    // Get the organizer's ID from the request or the authentication system
    const organizerId = req.params.id;

    // Find all tickets that belong to the organizer
    const tickets = await Ticket.find({ organizer: organizerId });

    res.status(200).json(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error getting tickets by organizer" });
  }
};

// Update a ticket by ID
export const updateTicket = async (req, res) => {
  try {
    const updatedTicket = await Ticket.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedTicket) {
      return res.status(404).json({ error: "Ticket not found" });
    }
    res.status(200).json(updatedTicket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a ticket by ID
export const deleteTicket = async (req, res) => {
  try {
    const deletedTicket = await Ticket.findByIdAndRemove(req.params.id);
    if (!deletedTicket) {
      return res.status(404).json({ error: "Ticket not found" });
    }
    res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//update the expiry date as the date come 
const updateExpiredTickets = async () => {
  try {
    const currentTime = new Date();

    console.log("Current Time:", currentTime);

    // Find tickets that have an expiry date and where the expiry date and time are in the past
    const expiredTickets = await Ticket.find({
      "expireDate.option": "At a specific time",
      $or: [
        {
          "expireDate.date": { $lt: currentTime },
        },
        {
          $and: [
            { "expireDate.date": { $eq: currentTime.toDateString() } },
            {
              "expireDate.hour": {
                $lt: currentTime.toLocaleTimeString("en-US"),
              },
            },
          ],
        },
      ],
      status: "active",
    });

    // Log the number of tickets found
    console.log("Number of Expired Tickets:", expiredTickets.length);

    // Update the status and isExpired fields of expired tickets
    for (const ticket of expiredTickets) {
      console.log("Updating Ticket:", ticket._id);

      ticket.status = "inactive"; // Update the status to "inactive"
      ticket.isExpired = true;

      console.log("Updated Ticket Status:", ticket.status);
      console.log("Updated Ticket isExpired:", ticket.isExpired);

      await ticket.save();

      console.log("Ticket Saved:", ticket._id);
    }
  } catch (error) {
    console.error("Error updating expired tickets:", error);
  }
};

// Define a cron job to run the updateExpiredTickets function daily
cron.schedule("* * * * *", () => {
  console.log("Running updateExpiredTickets cron job...");
  updateExpiredTickets();
});