import mongoose from "mongoose";
import validator from "validator";

function validateDate(dateString) {
  return validator.isDate(dateString);
}

function validateTime(timeString) {
  // Regular expression to validate HH:mm:ss format
  const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
  if (timeString === null) {
    return true; // Return true for null input
  }
  return timeRegex.test(timeString);
}


const eventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
  },
  eventCategory: String,
  location: String,
  country: String,
  city: String,
  zipCode: String,
  state: String,
  eventType: {
    type: String,
    enum: ["Single Event", "Recurring Event"],
  },
  rhythm: {
    type: String,
    enum: ["Daily","Weekly", "Monthly", "Yearly"],
  },
  startDate: {
    type: Date,
    validate: {
      validator: validateDate,
      message: "Invalid start date",
    },
  },
  endDate: {
    type: Date,
    validate: {
      validator: validateDate,
      message: "Invalid end date",
    },
  },
  endHour: {
    type: String,
    default: "23:59:59", // Set to 11:59 PM by default
  },
  startTimeOption: {
    type: String,
    enum: ["Per day", "Every Day"],
  },
  startTime: {
    type: String,
    validate: {
      validator: validateTime,
      message: "Invalid start time (use HH:MM:SS format)",
    },
  },
  startTimes: [
    {
      day: {
        type: Date,
        validate: {
          validator: validateDate,
          message: "Invalid date",
        },
      },
      time: {
        type: String,
        validate: {
          validator: validateTime,
          message: "Invalid start time (use HH:MM:SS format)",
        },
      },
    },
  ],
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
  endAfterXEvents: Number,
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  eventImage: String,
  media: [String],
  videoLink: String,
  banner:String,
  description: String,
  faqs: [
    {
      question: String,
      answer: String,
    },
  ],
  tickets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
    },
  ],
  participantDetails: {
    firstName: {
      type: Boolean,
      default: true,
    },
    lastName: {
      type: Boolean,
      default: true,
    },
    email: {
      type: Boolean,
      default: true,
    },
    // Dynamic fields, represented as Booleans based on client requirements
    title: Boolean, // mr , ms , mrs
    addition: Boolean,
    gender: Boolean,
    handicap: Boolean,
    privatePhone: Boolean,
    mobilePhone: Boolean,
    homeAddress: Boolean,
    deliveryAddress: Boolean,
    website: Boolean,
    blog: Boolean,
    jobTitle: Boolean,
    company: Boolean,
    businessAddress: Boolean,
    businessPhone: Boolean,
  },
  registrationTimeLimit: Number,
  visibility: {
    type: String,
    enum: ["Public", "Hidden", "Visible through code"],
  },
  accessCode: String, // Add this field to store the access code
  publicationDate: {
    option: {
      type: String,
      enum: ["Save as Draft", "Publish Later", "Publish Now"],
    },
    publishDate: {
      type: Date,
      validate: {
        validator: validateDate,
        message: "Invalid publish date",
      },
      required: function () {
        // Only required when publicationDate.option is "Publish Later"
        return this.publicationDate === "Publish Later";
      },
    },
    publishTime: {
      type: String,

      required: function () {
        // Only required when publicationDate.option is "Publish Later"
        return this.publicationDate === "Publish Later";
      },
    },
  },
  status: {
    type: String,
    enum: ["active", "inactive", "archived"],
    default: "inactive",
  },
  isDraft: { type: Boolean, default: false },
});

const Event = mongoose.model("Event", eventSchema);

export default Event;
