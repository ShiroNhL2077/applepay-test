import mongoose from "mongoose";
import validator from "validator";


const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  code: {
    type: String,
  },
  tickets: [
    {
      ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      isDiscounted: Boolean,
      qrCode: String, // Add the QR code field
      validity: {
        startDate: Date,
        endDate: Date,
        startTime: String,
        endTime: String,
      },
      purchaseDate: Date, // Add the purchase date field
    },
  ],
  isPaid: {
    type: Boolean,
    default: false,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  paymentDetails: {
    method: String,
    transactionId: String,
    status: String,
    totalAmount: Number,
    promoCode: String,
  },
  participantDetails: {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: "Invalid email address",
      },
    },
    title: String,
    addition: String,
    gender: String,
    handicap: Boolean,
    privatePhone: String,
    mobilePhone: String,
    homeAddress: String,
    deliveryAddress: String,
    website: String,
    blog: String,
    jobTitle: String,
    company: String,
    businessAddress: String,
    businessPhone: String,
  },

});


const Order = mongoose.model("Order", orderSchema);

export default Order;
