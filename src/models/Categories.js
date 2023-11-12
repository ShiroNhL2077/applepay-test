// Import required modules
import mongoose from "mongoose";

// Define the Category Schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // Make the name field unique
    },
    description: {
      type: String,
      required: [true, "Description is required"], // Mandatory field
      minlength: [5, "Description must be at least 5 characters long"],
      maxlength: [150, "Description must not exceed 150 characters"],
    },
    isActive: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt timestamps
  }
);

// Create the Category model
const Category = mongoose.model("Category", categorySchema);

// Export the Category model
export default Category;
