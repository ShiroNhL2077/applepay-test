import Event from "../models/Event.js";
import Ticket from "../models/Tickets.js";
import User from "../models/User.js";
import cron from "node-cron";

// Generate a random access code
const generateRandomCode = (length) => {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    code += charset[randomIndex];
  }
  return code;
};

export const createEvent = async (req, res) => {
  try {
    const eventData = req.body;
    const userId = req.user.id; // the current user data

    // Check if the organizer field is empty; if so, use the current user's ID
    if (!eventData.organizer) {
      // Set the organizer to the current user's ID
      eventData.organizer = userId;
    }

    // Check if it's a "Publish Later" event
    if (
      eventData.publicationDate &&
      eventData.publicationDate.option === "Publish Later"
    ) {
      const publishDateTime = new Date(eventData.publicationDate.publishDate);
      const eventStartDate = new Date(eventData.startDate);

      // Ensure that the publish date is earlier than the event start date
      if (publishDateTime >= eventStartDate) {
        return res.status(400).json({
          error: "Publish date must be earlier than the event start date.",
        });
      }
    }

    // Check if startDate is before endDate
    const eventStartDate = new Date(eventData.startDate);
    const eventEndDate = new Date(eventData.endDate);

    if (eventStartDate >= eventEndDate) {
      return res.status(400).json({
        error: "Event start date must be before the end date.",
      });
    }

    // Check if tickets are already assigned
    const assignedTickets = [];

    if (eventData.tickets && eventData.tickets.length > 0) {
      for (const ticketId of eventData.tickets) {
        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
          return res.status(400).json({
            error: `Ticket with ID ${ticketId} does not exist.`,
          });
        }

        if (ticket.isAssigned) {
          return res.status(400).json({
            error: `Ticket with ID ${ticketId} is already assigned to an event.`,
          });
        }

        assignedTickets.push(ticket);
      }
    }

    // Create a new event
    const event = new Event(eventData);

    // Generate a random access code if visibility is "Visible through code"
    if (eventData.visibility === "Visible through code") {
      const accessCode = generateRandomCode(8); //  adjust the length here if needed
      event.accessCode = accessCode;
    }

    // Set the status to "active" if the publicationDate option is "Publish Now"
    if (
      eventData.publicationDate &&
      eventData.publicationDate.option === "Publish Now"
    ) {
      event.status = "active";
      event.publicationDate.publishDate = new Date(); // Set to the current date
      event.publicationDate.publishTime = new Date().toLocaleTimeString(); // Set to the current time
    } else if (eventData.publicationDate.option === "Save as Draft") {
      event.isDraft = true; // Set isDraft to true if "Save as Draft" is chosen
    } else {
      // If it's not published now or saved as a draft, set the status to "inactive"
      event.status = "inactive";
    }

    const savedEvent = await event.save();

    // Now call a function to handle date and time logic
    await handleDateAndTimeLogic(savedEvent, assignedTickets);

    res.status(201).json(savedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Define a function to handle date and time logic
async function handleDateAndTimeLogic(event, assignedTickets) {
  // Set ticket's startDate and expireDate based on the ticket's options
  for (const ticket of assignedTickets) {
    if (ticket.startDate.option === "Upon the events release") {
      // Set ticket's startDate to the event's publication date and time
      ticket.startDate = {
        option: "Upon the events release",
        date: event.publicationDate.publishDate,
        hour: event.publicationDate.publishTime,
        timeZone: event.timeZone,
      };
    }

    if (ticket.expireDate.option === "On the end of the event") {
      // Set ticket's expire date and time
      ticket.expireDate = {
        option: "On the end of the event",
        date: event.endDate,
        hour: event.endHour,
        timeZone: event.timeZone,
      };
    }
    ticket.isAssigned = true;
    // Save the updated ticket
    await ticket.save();
  }
}

// Get all events
export const getEvents = async (req, res) => {
  try {
    // Use populate to get organizer and tickets data
    const events = await Event.find()
      .populate("organizer") // Replace 'organizer' with the actual field name in your Event model that references organizers
      .populate("tickets"); // Replace 'tickets' with the actual field name in your Event model that references tickets

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get an event by ID
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("organizer") // Replace 'organizer' with the actual field name in your Event model that references organizers
      .populate("tickets");
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// fetch all the events of one organizer
export const getEventsByOrganizer = async (req, res) => {
  try {
    const organizerId = req.params.organizerId;

    // Check if the organizer exists
    const organizer = await User.findById(organizerId);

    if (!organizer) {
      return res.status(404).json({ message: "Organizer not found." });
    }

    // Retrieve events associated with the organizer from database
    const events = await Event.find({ organizer: organizerId })
      .populate("organizer") // Replace 'organizer' with the actual field name in your Event model that references organizers
      .populate("tickets");

    // Check if there are no events for the organizer
    if (events.length === 0) {
      return res
        .status(404)
        .json({ message: "No events found for this organizer." });
    }

    // Return the list of events associated with the organizer
    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Update an event by ID
export const updateEvent = async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an event by ID
export const deleteEvent = async (req, res) => {
  try {
    // Find and update the event status to "inactive"
    const event = await Event.findByIdAndUpdate(req.params.id, {
      status: "inactive",
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Find and update associated tickets' statuses to "inactive"
    const updatedTickets = await Ticket.updateMany(
      { _id: { $in: event.tickets } },
      { status: "inactive" }
    );

    res.status(200).json({
      message: "Event and associated tickets deactivated successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// publish saved as draft event
export const publishSavedDraftEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ error: "Event not found." });
    }

    if (!event.isDraft) {
      return res.status(400).json({ error: "Event is not a draft." });
    }

    event.status = "active";
    event.isDraft = false;
    event.publicationDate.publishDate = new Date();
    event.publicationDate.publishTime = new Date().toLocaleTimeString();

    await event.save();

    const assignedTickets = await Ticket.find({ _id: { $in: event.tickets } });
    await handleDateAndTimeLogic(event, assignedTickets);

    res.status(200).json({ message: "Event published successfully." });
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
};

//retrieve events with isDraft set to true
export const getDraftsEvents = async (req, res) => {
  try {
    // Retrieve the ID of the logged-in user (organizer)
    const organizerId = req.user.id;

    // Query draft events associated with the organizer from the database
    const events = await Event.find({ organizer: organizerId, isDraft: true })
      .populate("organizer") // Replace 'organizer' with the actual field name in your Event model that references organizers
      .populate("tickets");;

    // Check if there are no draft events for the organizer
    if (events.length === 0) {
      return res.status(404).json({ message: "No draft events found." });
    }

    // Return the list of draft events associated with the organizer
    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Get All Active and Public Events
export const getActivePublicEvents = async (req, res) => {
  try {
    const activePublicEvents = await Event.find({
      status: "active",
      visibility: "Public",
    })
      .populate("organizer") // Replace 'organizer' with the actual field name in your Event model that references organizers
      .populate("tickets");;
    if (activePublicEvents.length === 0) {
      return res
        .status(404)
        .json({ message: "No active public events found." });
    }
    res.status(200).json(activePublicEvents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

//Get All Active and Hidden Events
export const getActiveHiddenEvents = async (req, res) => {
  try {
    const activeHiddenEvents = await Event.find({
      status: "active",
      visibility: "Hidden",
    })
      .populate("organizer") // Replace 'organizer' with the actual field name in your Event model that references organizers
      .populate("tickets");;

    if (activeHiddenEvents.length === 0) {
      return res
        .status(404)
        .json({ message: "No published hidden events found." });
    }

    res.status(200).json(activeHiddenEvents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

//Get Events Visible through An Access Code
export const getEventsVisibleWithAccessCode = async (req, res) => {
  try {
    const { accessCode } = req.params;

    const event = await Event.findOne({
      status: "active",
      visibility: "Visible through code",
      accessCode: accessCode,
    })
      .populate("organizer") // Replace 'organizer' with the actual field name in your Event model that references organizers
      .populate("tickets");;

    if (!event) {
      return res
        .status(404)
        .json({ message: "No event found with the provided access code." });
    }

    res.status(200).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// check and publish events that have a specific time to be published at
const checkAndPublishEvents = async () => {
  try {
    const currentTime = new Date();

    // Find events with a publicationDate set to "Publish Later" and where the combined
    // publishDate and publishTime is less than or equal to the current time
    const eventsToPublish = await Event.find({
      "publicationDate.option": "Publish Later",
      $and: [
        {
          "publicationDate.publishDate": { $lte: currentTime },
        },
        {
          $or: [
            { "publicationDate.publishDate": { $lt: currentTime } },
            {
              "publicationDate.publishTime": {
                $lte: currentTime.toLocaleTimeString("en-US"),
              },
            },
          ],
        },
      ],
      status: "inactive", // Optional: Add additional filters as needed
    });

    // Update the status of events to 'active' or 'published'
    for (const event of eventsToPublish) {
      event.status = "active";
      await event.save();
    }
  } catch (error) {
    console.error("Error checking and publishing events:", error);
  }
};

// Define a cron job to run the checkAndPublishEvents function periodically
cron.schedule("* * * * *", () => {
  checkAndPublishEvents();
});
