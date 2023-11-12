
import Event from "../models/Event.js";
import securityAgents from "../models/securityAgents.js";


// Create a new security agent
// Create a new security agent
export const createSecurityAgent = async (req, res) => {
  try {
    const { name, email, event, password, position } = req.body;

    // Check if the email already exists
    const existingEmail = await securityAgents.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Check if the name already exists
    const existingName = await securityAgents.findOne({ name });
    if (existingName) {
      return res.status(400).json({ error: "Name already exists" });
    }

    // Check if the event exists and its endDate is not expired
    const existingEvent = await Event.findOne({ _id: event, endDate: { $gte: new Date() } });
    if (!existingEvent) {
      return res.status(400).json({ error: "Invalid event or event has already ended" });
    }

    // Create a new security agent
    const agent = new securityAgents({
      name,
      email,
      event,
      password,
      position,
    });

    const savedAgent = await agent.save();
    res.status(201).json(savedAgent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating security agent" });
  }
};

// Get all security agents
export const getAllSecurityAgents = async (req, res) => {
  try {
    const securityAgentsList = await securityAgents.find();
    res.status(200).json(securityAgentsList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error getting security agents" });
  }
};

// Get a security agent by ID
export const getSecurityAgentById = async (req, res) => {
  try {
    const { id } = req.params;
    const securityAgent = await securityAgents.findById(id);
    if (!securityAgent) {
      return res.status(404).json({ message: "Security agent not found" });
    }
    res.status(200).json(securityAgent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error getting security agent" });
  }
};

// Activate a security agent by ID
export const activateSecurityAgentAccount = async (req, res) => {
  try {
    const id = req.params.id; // Assuming you receive the ID as a parameter

    // Find the security agent by ID and update the isActivated field
    const updatedSecurityAgent = await securityAgents.findByIdAndUpdate(
      id,
      { isActivated : true }, // Update isActivated to true
      { new: true }
    );

    if (!updatedSecurityAgent) {
      return res.status(404).json({ error: 'Security agent not found' });
    }

    res.status(200).json(updatedSecurityAgent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error activating security agent' });
  }
};

// Deactivate a security agent by ID
export const deactivateSecurityAgent = async (req, res) => {
  try {
    const id = req.params.id; // Assuming you receive the ID as a parameter

    // Find the security agent by ID and update the isActivated field
    const updatedSecurityAgent = await securityAgents.findByIdAndUpdate(
      id,
      { isActivated : false }, // Update isActivated to false
      { new: true }
    );

    if (!updatedSecurityAgent) {
      return res.status(404).json({ error: 'Security agent not found' });
    }

    res.status(200).json(updatedSecurityAgent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deactivating security agent' });
  }
};


// Update a security agent by ID
export const updateSecurityAgentById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedSecurityAgent = await securityAgents.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedSecurityAgent) {
      return res.status(404).json({ message: "Security agent not found" });
    }
    res.status(200).json(updatedSecurityAgent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating security agent" });
  }
};
