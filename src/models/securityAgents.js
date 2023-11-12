import mongoose from "mongoose";

const securityAgentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  event: 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
  
  password: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
    enum: ["Check-in", "Check-out"],
  },
  isActivated: {
    type: Boolean,
    required: false,
    default: false,
  },
});

export default mongoose.model("SecurityAgent", securityAgentSchema);
