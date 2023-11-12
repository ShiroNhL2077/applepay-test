import mongoose from "mongoose";
import validator from "validator";

const organizerSchema = new mongoose.Schema({
  // Organizer-specific fields here
  isProfessional: {
    type: Boolean,
    default: false,
  },
  organizationName: {
    type: String,
    trim: true,
  },
  document: {
    type: String,
  },
  isApproved: {
    type: Boolean,
    default: false, // Organizer account is not approved by default
  },
});

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: "Invalid email address",
    },
  },
  phone: {
    type: String,
    validate: {
      validator: function (phone) {
        // Regular expression to validate German phone number format
        return /^(\+49|0)[0-9]{10,11}$/.test(phone);
      },
      message: (props) => `${props.value} is not a valid German phone number!`,
    },
  },
  country: {
    type : String
  },

  address : String,
  role: {
    type: String,
    enum: ["admin", "organizer", "buyer", "reseller", "securityAgent"],
    required: true,
  },

  verificationToken: {
    type: String,
    unique: true,
    sparse: true, // Allows multiple null values but enforces unique for non-null values
  },

  // Add verificationTokenExpires as a Date field
  verificationTokenExpires: {
    type: Date,
  },

  resetPasswordToken: String, // Stores the password reset token
  resetPasswordExpires: Date, // Stores the expiration date for the token

  isVerified: {
    type: Boolean,
    default: false, // User account is not verified by default
  },
  organizerInfo: organizerSchema, // Include the organizer subdocument
});

export default mongoose.model("User", userSchema);
