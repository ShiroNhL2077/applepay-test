import mongoose, { model } from "mongoose";
import validator from "validator";

// Function to validate date format
function validateDate(dateString) {
  if (dateString === null) {
    return true; // Return true for null input
  }
  return validator.isDate(dateString);
}

// Function to validate time format
function validateTime(timeString) {
  // Regular expression to validate HH:mm:ss format
  const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
  if (timeString === null) {
    return true; // Return true for null input
  }
  return timeRegex.test(timeString);
}


const ticketSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ["paid", "free", "voluntary", "donation"],
    required: true,
  },
  description: { type: String },
  location: { type: String },
  price: { type: Number },
  currency: { type: String },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  priceCategory: {
    isDiscounted: {
      type: Boolean,
      default: false,
    },
    discountName: {
      type: String,
      enum: ["standard", "student"],
      required: function () {
        return this.isDiscounted === true;
      },
    },
    discountAmount: {
      type: Number,
      required: function () {
        return this.isDiscounted === true;
      },
    },
  },
  quantity: { type: Number },
  visibility: {
    type: String,
    enum: [
      "Always visible",
      "Only visible by selecting another ticket type",
      "Visible only with code",
    ],
  },
  selectability: {
    type: String,
    enum: [
      "Always",
      "Only selectable when another ticket is selected",
      "Only selectable when another ticket is sold out",
    ],
  },
  linkedTicket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ticket",
    required: function () {
      return (
        this.selectability ===
          "Only selectable when another ticket is selected" ||
        this.selectability === "Only selectable when another ticket is sold out"
      );
    },
  },
  ticketsPerOrder: {
    minQuantity: { type: Number },
    maxQuantity: { type: Number },
  },
  startDate: {
    type: {
      option: {
        type: String,
        enum: ["Upon the events release", "On a specific date"],
      },
      date: {
        type: Date,
        validate: {
          validator: validateDate,
          message: "Invalid date format (use YYYY-MM-DD format)",
        },
      },
      hour: {
        type: String,
        validate: {
          validator: validateTime,
          message: "Invalid start time (use HH:MM:SS format)",
        },
      },
      timeZone: {
        type: String,
        enum: [
          "UTC",
          "GMT",
          "WET",
          "IST",
          "CET",
          "WEST",
          "CEST",
          "EET",
          "EEST",
          "MSK",
          "AST",
          "MUT",
          "RET",
          "GET",
          "AZT",
          "SAMT",
          "AMT",
          "UZT",
          "PKT",
          "MVT",
          "TFT",
          "OMST",
          "ALMT",
          "KZT",
          "BST",
          "NPT",
          "IOT",
          "MMT",
          "SLT",
          "NDT",
          "AFT",
          "IRST",
          "IRDT",
          "PKT",
          "IST",
          "NPT",
          "BTT",
          "UZT",
          "ALMT",
          "KRAT",
          "SGT",
          "ULAT",
          "KST",
          "JST",
          "ACST",
          "ACDT",
          "AEDT",
          "VUT",
          "SBT",
          "SRET",
          "KAMT",
          "FJT",
          "TOT",
          "LINT",
        ],
      },
    },
    default: {
      option: "Upon the events release",
      date: null,
      hour: null,
      timeZone: "UTC",
    },
  },
  expireDate: {
    type: {
      option: {
        type: String,
        enum: ["On the end of the event", "On a specific date"],
      },
      date: {
        type: Date,
        validate: {
          validator: validateDate,
          message: "Invalid date format (use YYYY-MM-DD format)",
        },
      },
      hour: {
        type: String,
        validate: {
          validator: validateTime,
          message: "Invalid start time (use HH:MM:SS format)",
        },
      },
      timeZone: {
        type: String,
        enum: [
          "UTC",
          "GMT",
          "WET",
          "IST",
          "CET",
          "WEST",
          "CEST",
          "EET",
          "EEST",
          "MSK",
          "AST",
          "MUT",
          "RET",
          "GET",
          "AZT",
          "SAMT",
          "AMT",
          "UZT",
          "PKT",
          "MVT",
          "TFT",
          "OMST",
          "ALMT",
          "KZT",
          "BST",
          "NPT",
          "IOT",
          "MMT",
          "SLT",
          "NDT",
          "AFT",
          "IRST",
          "IRDT",
          "PKT",
          "IST",
          "NPT",
          "BTT",
          "UZT",
          "ALMT",
          "KRAT",
          "SGT",
          "ULAT",
          "KST",
          "JST",
          "ACST",
          "ACDT",
          "AEDT",
          "VUT",
          "SBT",
          "SRET",
          "KAMT",
          "FJT",
          "TOT",
          "LINT",
        ],
      },
    },
    default: {
      option: "On the end of the event",
      date: null,
      hour: null,
      timeZone: "UTC",
    },
  },

  displayOptions: {
    remainingTickets: { type: Number, default: 0 },
    soldOut: { type: Boolean, default: false },
  },
  isAssigned: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ["active", "inactive", "archived"],
    default: "active",
  },
  isExpired: { type: Boolean, default: false },
});

const Ticket = model("Ticket", ticketSchema);

export default Ticket;
