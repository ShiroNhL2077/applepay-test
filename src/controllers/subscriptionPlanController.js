import SubscriptionPlan from "../models/subscriptionPlan.js";

// Create a new subscription plan
export const createSubscriptionPlan = async (req, res) => {
  try {
    const newPlan = await SubscriptionPlan.create(req.body);
    res.status(201).json(newPlan);
  } catch (error) {
    res.status(500).json({ error: "Unable to create subscription plan" });
  }
};


// Get all subscription plans
export const getAllSubscriptionPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find();
    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ error: "Unable to retrieve subscription plans" });
  }
};

// Get a subscription plan by ID
export const getSubscriptionPlanById = async (req, res) => {
  const { id } = req.params;
  try {
    const plan = await SubscriptionPlan.findById(id);
    if (!plan) {
      return res.status(404).json({ error: "Subscription plan not found" });
    }
    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ error: "Unable to retrieve subscription plan" });
  }
};

// Update a subscription plan by ID
export const updateSubscriptionPlan = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedPlan = await SubscriptionPlan.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedPlan) {
      return res.status(404).json({ error: "Subscription plan not found" });
    }
    res.status(200).json(updatedPlan);
  } catch (error) {
    res.status(500).json({ error: "Unable to update subscription plan" });
  }
};

// Safely delete a subscription plan by ID
export const deleteSubscriptionPlan = async (req, res) => {
  const { id } = req.params;
  try {
    const plan = await SubscriptionPlan.findById(id);
    if (!plan) {
      return res.status(404).json({ error: "Subscription plan not found" });
    }

    // Later I must ensure any logic to prevent cascading delete here, e.g., checking if the plan is in use

    // Soft delete: Set the isActive field to false instead of removing the document
    plan.isActive = false;
    await plan.save();

    res
      .status(200)
      .json({ message: "Subscription plan deleted (soft delete)" });
  } catch (error) {
    res.status(500).json({ error: "Unable to delete subscription plan" });
  }
};
