import express from "express";
import { protect, restrictToAdmin } from "../middlewares/authMiddleware.js";
import {
  deactivateSecurityAgent,
  createSecurityAgent,
  getAllSecurityAgents,
  getSecurityAgentById,
  activateSecurityAgentAccount,
  updateSecurityAgentById,
} from "../controllers/SecurityAgentsController.js";
const AdminRouter = express.Router();

// Protected routes for admin (requires authentication)

/* Routes for managing security agents*/


// Create a new security agent
AdminRouter.post(
  "/security-agents/add",
  protect,
  restrictToAdmin,
  createSecurityAgent
);

// Get all security agents
AdminRouter.get(
  "/security-agents",
  protect,
  restrictToAdmin,
  getAllSecurityAgents
);

// Get a security agent by ID
AdminRouter.get(
  "/security-agents/:id",
  protect,
  restrictToAdmin,
  getSecurityAgentById
);


// Ban a security agent by id
AdminRouter.patch(
  "/security-agents/deactivate/:id",
  protect,
  restrictToAdmin,
  deactivateSecurityAgent
);

// Unban a security agent by code
AdminRouter.patch(
  "/security-agents/activate/:id",
  protect,
  restrictToAdmin,
  activateSecurityAgentAccount
);

// Update a security agent by ID
AdminRouter.put(
  "/security-agents/update/:id",
  protect,
  restrictToAdmin,
  updateSecurityAgentById
);


export default AdminRouter;
