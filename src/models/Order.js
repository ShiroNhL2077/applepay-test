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
    },
  ],
  isPaid: {
    type: Boolean,
    default: false, // Set to false initially, indicating the order is unpaid
  },
  orderDate: {
    type: Date, // Date and time when the order was placed
    default: Date.now, // Set the default value to the current date and time
  },
  paymentDetails: {
    method: String, // Payment method used
    transactionId: String, // Payment transaction ID
    status: String,
    totalAmount: Number, // Total amount paid
    promoCode: String, // Promo code or discount applied
    /* card: {
      last4: String, // Add the last 4 digits of the card number
      brand: String, // Add the card brand
      expMonth: Number, // Add the card's expiration month
      expYear: Number, // Add the card's expiration year
    },*/
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
