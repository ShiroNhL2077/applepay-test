import mongoose from "mongoose";

import crypto from "crypto";
import QRCode from "qrcode";
import cron from "node-cron";
import Event from "../models/Event.js";
import Order from "../models/Order.js";
import Ticket from "../models/Tickets.js";
import OrderTicketAssociation from "../models/orderTicketAssociation.js";
import Stripe from "stripe";
import paypal from "paypal-rest-sdk";
import { sendStripePaymentEmail } from "./mailerController.js";

import dotenv from "dotenv";
/* Accessing .env content */
dotenv.config();

/*Stripe client initialization */
const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);

/*Paypal client initialization */

paypal.configure({
  mode: "sandbox", // Change to 'live' for production
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

/*Generates a code for tickets */
function generateTicketCode() {
  // Define the character set for the code
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let code = "";

  // Generate 8 random characters
  for (let i = 0; i < 8; i++) {
    const randomIndex = crypto.randomInt(0, characters.length);
    code += characters.charAt(randomIndex);
  }

  return code;
}
function generateOrderCode(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function generateUniqueOrderCode() {
  const minCode = 1000000000; // Define the minimum order code
  const maxCode = 9999999999; // Define the maximum order code

  while (true) {
    const generatedCode = generateOrderCode(minCode, maxCode);
    const existingOrder = await Order.findOne({ code: generatedCode });

    if (!existingOrder) {
      // The generated code is unique
      return generatedCode;
    }
  }
}

/**Create and Pay an order with Stripe: apple pay */

export const createPaymentIntent = async (req, res) => {
  try {
    const intent = await stripeClient.paymentIntents.create({
      amount: 1099,
      currency: "eur",
    });
    res.json({ client_secret: intent.client_secret });
  } catch (error) {
    console.error("Error creating PaymentIntent:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**Create and Pay an order with Stripe: card */
export const createOrderWithStripe = async (req, res) => {
  const session = await mongoose.startSession({
    defaultTransactionOptions: {
      readConcern: { level: "snapshot" },
      writeConcern: { w: "majority" },
    },
    // Set the expiration time for the session (in milliseconds)
    expire: 3600000, // 1 hour (adjust the time as needed)
  });
  session.startTransaction();

  try {
    const {
      eventId,
      items,
      participantDetails,
      validityStartDate,
      validityEndDate,
      validityStartTime,
      validityEndTime,
      paymentMethod,
    } = req.body;
    // Step 1: Verify event
    const event = await Event.findById(eventId).session(session);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Initialize the totalAmount
    let totalAmount = 0;
    let totalQuantity = 0;
    // Generate a unique order code

    const uniqueOrderCode = await generateUniqueOrderCode();
    // Create a new order document
    const orderData = {
      event: eventId,
      isPaid: false,
      code: uniqueOrderCode.toString(),
      participantDetails: participantDetails,
      tickets: [],
    };

    if (req.user) {
      orderData.user = req.user.id;
    }

    const order = new Order(orderData);

    // Create an array to store the QR codes
    const qrCodes = [];

    // Create an object to group tickets by order
    const orderTicketGroups = {};

    // Initialize ticket
    let ticket;

    // Step 5: Process items
    for (const item of items) {
      const { ticketId, quantity } = item;
      totalQuantity += quantity; // Update the total quantity

      // Verify the ticket and its availability (within the session)
      ticket = await Ticket.findById(ticketId).session(session);
      if (!ticket) {
        return res.status(404).json({ error: "Ticket not found" });
      }

      const { minQuantity, maxQuantity } = ticket.ticketsPerOrder;

      if (quantity < minQuantity || quantity > maxQuantity) {
        return res.status(400).json({
          error: `Quantity must be between ${minQuantity} and ${maxQuantity}`,
        });
      }

      if (ticket.displayOptions.remainingTickets < quantity) {
        return res
          .status(400)
          .json({ error: "Insufficient ticket quantity available" });
      }

      const isDiscounted = ticket.priceCategory.isDiscounted;
      if (isDiscounted) {
        totalAmount +=
          (ticket.price - ticket.priceCategory.discountAmount) * quantity;
      } else {
        totalAmount += ticket.price * quantity;
      }

      for (let i = 0; i < quantity; i++) {
        const qrCodeData = {
          firstName: participantDetails.firstname,
          lastName: participantDetails.lastname,
          eventName: event.eventName,
          ticketCode: generateTicketCode(),
          ticketName: ticket.name,
          ticketLocation: ticket.location,

          validity: {
            startDate: validityStartDate,
            endDate: validityEndDate,
            startTime: validityStartTime,
            endTime: validityEndTime,
          },
        };

        const qrCodeDataJson = JSON.stringify(qrCodeData);

        const url = await QRCode.toDataURL(qrCodeDataJson);

        qrCodes.push(url);

        // Use the `ticketId` from the outer scope (defined within the loop)
        order.tickets.push({
          ticket: ticketId,
          quantity: 1,
          qrCode: url,
          isDiscounted: isDiscounted,
          validity: {
            startDate: validityStartDate,
            endDate: validityEndDate,
            startTime: validityStartTime,
            endTime: validityEndTime,
          },
        });

        if (!orderTicketGroups[order._id]) {
          orderTicketGroups[order._id] = {
            order: order._id,
            tickets: [
              {
                ticket: ticketId,
                qrCodes: [url],
                purchaseDate: new Date(),
                validity: {
                  startDate: validityStartDate,
                  endDate: validityEndDate,
                  startTime: validityStartTime,
                  endTime: validityEndTime,
                },
              },
            ],
          };
        } else {
          orderTicketGroups[order._id].tickets.push({
            ticket: ticketId,
            purchaseDate: new Date(),
            qrCodes: [url],
            validity: {
              startDate: validityStartDate,
              endDate: validityEndDate,
              startTime: validityStartTime,
              endTime: validityEndTime,
            },
          });
        }

        ticket.displayOptions.remainingTickets -= 1;

        if (ticket.displayOptions.remainingTickets === 0) {
          ticket.displayOptions.soldOut = true;
        }

        await ticket.save();
      }
    }

    // Create a customer in Stripe with additional data, including the IP address
    const customer = await stripeClient.customers.create({
      email: participantDetails.email, // Customer's email
      name: `${participantDetails.firstname} ${participantDetails.lastname}`, // Customer's name
      metadata: {
        ip_address: req.ip, // User's IP address
        // Add other billing details if needed
      },
    });

    // Retrieve the currency from the ticket and convert it to lowercase
    const currency = ticket.currency.toLowerCase();

    // Create a test payment intent using Stripe library
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: Math.round(totalAmount * 100),
      currency,
      payment_method_types: ["card", "klarna"],
      payment_method: paymentMethod,
      confirm: true,
      customer: customer.id, // Associate the customer with the payment intent
    });

    // Handle the payment intent status
    if (paymentIntent.status === "succeeded") {
      order.isPaid = true;
      order.paymentDetails = {
        method: "stripe",
        transactionId: paymentIntent.id,
        totalAmount: totalAmount,
        status: "succeeded",
      };
    } else {
      return res.status(400).json({ error: "Payment failed" });
    }

    // Save changes to the database in a transaction
    await order.save({ session });

    // Insert grouped order-ticket associations into the OrderTicketAssociation collection
    const groupedAssociations = Object.values(orderTicketGroups).map(
      (group) => ({
        ...group,
        purchaseDate: new Date(),
        validity: {
          startDate: validityStartDate,
          endDate: validityEndDate,
          startTime: validityStartTime,
          endTime: validityEndTime,
        },
      })
    );
    await OrderTicketAssociation.insertMany(groupedAssociations, { session });
    const ticketDetails = [];

    for (const item of items) {
      const ticketId = item.ticketId;
      const quantity = item.quantity;
      const ticket = await Ticket.findById(ticketId);

      // Push the ticket details to the array
      ticketDetails.push({
        name: ticket.name,
        price: ticket.price,
        quantity: quantity,
      });
    }
    await session.commitTransaction();
    session.endSession();
    // Send payment success email to the customer
    // After calculating the totalQuantity
    console.log("Total number of tickets bought:", totalQuantity);
    const emailResponse = await sendStripePaymentEmail({
      customerEmail: participantDetails.email,
      totalAmount: totalAmount,
      currency: ticket.currency,
      email: participantDetails.email,
      transactionId: paymentIntent.id,
      totalQuantity: totalQuantity,
      orderCode: uniqueOrderCode,
      purchaseDate: Date(),
      eventDetails: {
        eventName: event.eventName,
        location: event.location,
        startDate: event.startDate,
        startTime: event.startTime,
        endTime: event.endHour,
      },
      participantDetails: {
        firstname: participantDetails.firstname,
        lastname: participantDetails.lastname,
      },
      ticketDetails: ticketDetails, // Pass the array of ticket details
    });

    return res
      .status(201)
      .json({ message: "Order created successfully", emailResponse });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res
      .status(500)
      .json({ error: `Order creation failed: ${error.message}` });
  }
};

// Function to create an order with PayPal
export const createOrderWithPayPal = async (req, res) => {
  const session = await mongoose.startSession({
    defaultTransactionOptions: {
      readConcern: { level: "snapshot" },
      writeConcern: { w: "majority" },
      // Add other session options as needed
    },
    // Set the expiration time for the session (in milliseconds)
    expire: 3600000, // 1 hour (adjust the time as needed)
  });
  session.startTransaction();

  try {
    const {
      eventId,
      items,
      participantDetails,
      validityStartDate,
      validityEndDate,
      validityStartTime,
      validityEndTime,
    } = req.body;

    // Step 1: Verify the event
    const event = await Event.findById(eventId).session(session);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Initialize the totalAmount
    let totalAmount = 0;

    // Create a new order document
    const orderData = {
      event: eventId,
      isPaid: false, // Initially, the order is unpaid
      participantDetails: participantDetails,
      tickets: [],
    };

    if (req.user) {
      orderData.user = req.user.id;
    }

    const order = new Order(orderData);

    // Create an array to store the QR codes
    const qrCodes = [];

    // Create an object to group tickets by order
    const orderTicketGroups = {};

    // Initialize ticket
    let ticket;

    // Step 2: Process items
    for (const item of items) {
      const { ticketId, quantity } = item;

      // Verify the ticket and its availability (within the session)
      ticket = await Ticket.findById(ticketId).session(session);
      if (!ticket) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ error: "Ticket not found" });
      }

      const { minQuantity, maxQuantity } = ticket.ticketsPerOrder;

      if (quantity < minQuantity || quantity > maxQuantity) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          error: `Quantity must be between ${minQuantity} and ${maxQuantity}`,
        });
      }

      if (ticket.displayOptions.remainingTickets < quantity) {
        await session.abortTransaction();
        session.endSession();
        return res
          .status(400)
          .json({ error: "Insufficient ticket quantity available" });
      }

      const isDiscounted = ticket.priceCategory.isDiscounted;
      if (isDiscounted) {
        totalAmount +=
          (ticket.price - ticket.priceCategory.discountAmount) * quantity;
      } else {
        totalAmount += ticket.price * quantity;
      }

      for (let i = 0; i < quantity; i++) {
        // Create QR codes and handle tickets as before
        const qrCodeData = {
          firstName: participantDetails.firstname,
          lastName: participantDetails.lastname,
          eventName: event.eventName,
          ticketCode: generateTicketCode(), // Implement a function to generate ticket codes
          ticketName: ticket.name,
          ticketLocation: ticket.location,
          validity: {
            startDate: validityStartDate,
            endDate: validityEndDate,
            startTime: validityStartTime,
            endTime: validityEndTime,
          },
        };

        const qrCodeDataJson = JSON.stringify(qrCodeData);

        const url = await QRCode.toDataURL(qrCodeDataJson); // Use a library to generate QR codes

        qrCodes.push(url);

        order.tickets.push({
          ticket: ticketId,
          quantity: 1,
          qrCode: url,
          isDiscounted: isDiscounted,
        });

        // Handle orderTicketGroups as before
        if (!orderTicketGroups[order._id]) {
          orderTicketGroups[order._id] = {
            order: order._id,
            tickets: [
              {
                ticket: ticketId,
                qrCodes: [url],
                purchaseDate: new Date(),
                validity: {
                  startDate: validityStartDate,
                  endDate: validityEndDate,
                  startTime: validityStartTime,
                  endTime: validityEndTime,
                },
              },
            ],
          };
        } else {
          orderTicketGroups[order._id].tickets.push({
            ticket: ticketId,
            purchaseDate: new Date(),
            qrCodes: [url],
            validity: {
              startDate: validityStartDate,
              endDate: validityEndDate,
              startTime: validityStartTime,
              endTime: validityEndTime,
            },
          });
        }

        // Update the remaining ticket count and mark as sold out if necessary
        ticket.displayOptions.remainingTickets -= 1;

        if (ticket.displayOptions.remainingTickets === 0) {
          ticket.displayOptions.soldOut = true;
        }

        await ticket.save();
      }
    }

    // Retrieve the currency from the ticket and convert it to uppercase
    const currency = ticket.currency.toUpperCase();

    // Create a PayPal payment using the ticket's currency
    const createPayment = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "http://yourwebsite.com/success", // Replace with your actual return URL
        cancel_url: "http://yourwebsite.com/cancel", // Replace with your actual cancel URL
      },
      transactions: [
        {
          amount: {
            total: totalAmount.toFixed(2), // Convert back to currency
            currency, // Use the currency from the ticket (uppercase)
          },
          description: "Event Tickets Purchase",
        },
      ],
    };

    // Create a PayPal payment
    paypal.payment.create(createPayment, async (error, payment) => {
      if (error) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ error: "PayPal payment failed" });
      } else {
        for (const link of payment.links) {
          if (link.method === "REDIRECT") {
            // Send the PayPal approval URL as a JSON response
            order.paymentDetails = {
              method: "PayPal",
              transactionId: payment.id,
              status: "Pending", // Update with the appropriate status
              totalAmount: totalAmount,
              promoCode: "", // Update with the promo code or discount applied
            };
            await order.save();

            return res.json({ approval_url: link.href });
          }
        }
        return res.status(400).json({ error: "PayPal approval URL not found" });
      }
    });

    // Save changes to the database in a transaction
    await order.save({ session });

    // Insert grouped order-ticket associations into the OrderTicketAssociation collection
    const groupedAssociations = Object.values(orderTicketGroups).map(
      (group) => ({
        ...group,
        purchaseDate: new Date(),
      })
    );
    // Insert grouped associations into the OrderTicketAssociation collection
    await OrderTicketAssociation.insertMany(groupedAssociations, { session });

    await session.commitTransaction();
    session.endSession();
    // Send payment success email to the customer
    sendStripePaymentEmail(participantDetails.email, totalAmount);
    // Return a success response
    /* return res
      .status(201)
      .json({ message: "Order created successfully", order });*/
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res
      .status(500)
      .json({ error: `Order creation failed: ${error.message}` });
  }
};

// Function to process PayPal webhook events
export const processPayPalWebhookEvent = async (req, res) => {
  // Retrieve the webhook event data from the request body
  const event = req.body;

  console.log(event);

  try {
    // Process the webhook event based on its type
    switch (event.event_type) {
      case "PAYMENTS.PAYMENT.CREATED":
        // Handle the payment created event
        // Retrieve the payment details
        const paymentId = event.resource.id;

        // Retrieve the order from the database based on the payment ID or any other relevant identifier
        const order = await Order.findOne({
          "paymentDetails.transactionId": paymentId,
        });

        // Check if the order exists
        if (!order) {
          return res.status(400).json({ error: "Order not found" });
        }

        // Check if the order has already been paid
        if (order.isPaid) {
          return res.status(400).json({ error: "Order has already been paid" });
        }

        // Update the order with payment information
        order.isPaid = true;
        order.paymentDetails = {
          method: "PayPal", // Update with the actual payment method used
          transactionId: paymentId,
          status: "Paid", // Update with the appropriate status
          totalAmount: order.totalPrice, // Update with the actual total amount
          promoCode: "", // Update with the promo code or discount applied
        };

        // Update ticket availability based on the order
        for (const item of order.tickets) {
          const { ticket, quantity } = item;
          const ticketDocument = await Ticket.findById(ticket);

          if (ticketDocument) {
            ticketDocument.displayOptions.remainingTickets -= quantity;

            if (ticketDocument.displayOptions.remainingTickets <= 0) {
              ticketDocument.displayOptions.remainingTickets = 0;
              ticketDocument.displayOptions.soldOut = true;
            }

            await ticketDocument.save();
          }
        }

        await order.save();

        break;

      // Add more cases to handle other webhook events if needed

      default:
        // Handle unrecognized webhook events
        console.log("Received webhook event:", event.event_type);
        break;
    }

    // Send a response back to PayPal indicating successful processing of the webhook event
    res.status(200).end();
  } catch (error) {
    // Handle errors that occurred during webhook event processing
    console.error("Error processing webhook event:", error);
    res.status(500).json({ error: "Failed to process webhook event" });
  }
};

//Get All Orders for a Specific Event
export const getAllOrdersForEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    // Use a query to find all orders related to the event with the given eventId
    const orders = await Order.find({ event: eventId });
    return res.status(200).json(orders);
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Error fetching orders: ${error.message}` });
  }
};

//Get All Orders:
export const getAllOrders = async (req, res) => {
  try {
    // Fetch all orders from the database
    const orders = await Order.find();
    return res.status(200).json(orders);
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Error fetching orders: ${error.message}` });
  }
};

//Get All Orders:
export const getAllTick = async (req, res) => {
  try {
    // Fetch all orders from the database
    const associations = await OrderTicketAssociation.find();
    return res.status(200).json(associations);
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Error fetching orders: ${error.message}` });
  }
};

//Get Order by ID:
export const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    // Use a query to find the order with the given orderId
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    return res.status(200).json(order);
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Error fetching order: ${error.message}` });
  }
};

//Get All Orders for a Logged-In User:
export const getAllOrdersForUser = async (req, res) => {
  try {
    const userId = req.user.id;

    // Use a query to find all paid orders related to the user with the given userId
    const paidOrders = await Order.find({ user: userId, isPaid: true })
      .populate("event")
      .populate({
        path: "tickets",
        populate: { path: "ticket" }, // Populate the 'ticket' field inside each item in the 'tickets' array
      });

    return res.status(200).json(paidOrders);
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Error fetching paid user orders: ${error.message}` });
  }
};

const cleanupUnpaidOrders = async () => {
  try {
    const cleanupThreshold = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago

    // Define your cleanup criteria
    const cleanupQuery = {
      isPaid: false,
      orderDate: { $lt: cleanupThreshold },
    };

    // Find orders that meet the cleanup criteria
    const unpaidOrders = await Order.find(cleanupQuery);

    // Clean up the identified unpaid orders using findByIdAndRemove
    for (const order of unpaidOrders) {
      const removedOrder = await Order.findByIdAndRemove(order._id);
      if (removedOrder) {
        console.log(`Removed order: ${removedOrder._id}`);
      }
    }

    console.log(`Cleaned up ${unpaidOrders.length} unpaid orders.`);
  } catch (error) {
    console.error("Order cleanup job failed:", error);
  }
};

// Define a cron schedule to run the cleanupUnpaidOrders function every hour
cron.schedule("0 * * * *", async () => {
  console.log("Running cleanupUnpaidOrders cron job...");
  cleanupUnpaidOrders();
});
