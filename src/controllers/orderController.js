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
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import archiver from "archiver";
import { sendPaymentEmail } from "./mailerController.js";

import dotenv from "dotenv";
import { fileURLToPath } from "url";
/* Accessing .env content */
dotenv.config();

/*Stripe client initialization */
const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
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
    const { amount } = req.body;

    const intent = await stripeClient.paymentIntents.create({
      amount: 1999,
      payment_method_types: ["card"],
      currency: "eur",
      // Add other parameters specific to the payment method (e.g., setup_future_usage for cards)
    });

    console.log(req.body);
    res.json({ client_secret: intent.client_secret });
  } catch (error) {
    console.error("Error creating PaymentIntent:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**Create and Pay an order with Stripe: card */

// In createOrderWithStripe function
export const createOrderWithStripe = async (req, res) => {
  // Start a MongoDB session
  const session = await mongoose.startSession({
    defaultTransactionOptions: {
      readConcern: { level: "snapshot" },
      writeConcern: { w: "majority" },
    },
    expire: 3600000,
  });
  session.startTransaction();

  try {
    // Extract necessary data from the request body
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

    // Find the event in the database
    const event = await Event.findById(eventId).session(session);
    if (!event) {
      return res.status(404).json({ error: "Event not found..." });
    }

    // Initialize variables for total amount, total quantity, and the current ticket
    let totalAmount = 0;
    let totalQuantity = 0;
    let ticket;

    // Generate a unique order code
    const uniqueOrderCode = await generateUniqueOrderCode();

    // Create the initial order data
    const orderData = {
      event: eventId,
      isPaid: false, // Set isPaid to false initially
      code: uniqueOrderCode.toString(),
      participantDetails: participantDetails,
      tickets: [],
    };

    // If there is a logged-in user, associate the order with the user
    if (req.user) {
      orderData.user = req.user.id;
    }

    // Create a new Order instance with the initial data
    const order = new Order(orderData);

    // Save the order to the database
    await order.save();

    // Array to store details of each ticket for email purposes
    const ticketDetails = [];

    // Process each item in the request and update order details
    for (const item of items) {
      const { ticketId, quantity } = item;
      totalQuantity += quantity;

      // Find the ticket in the database
      ticket = await Ticket.findById(ticketId).session(session);
      if (!ticket) {
        return res.status(404).json({ error: "Ticket not found" });
      }

      // Validate quantity against the ticket's limits
      const { minQuantity, maxQuantity } = ticket.ticketsPerOrder;
      if (quantity < minQuantity || quantity > maxQuantity) {
        return res.status(400).json({
          error: `Quantity must be between ${minQuantity} and ${maxQuantity}`,
        });
      }

      // Calculate the total amount based on ticket price and quantity
      totalAmount += ticket.price * quantity;

      // Generate QR code data
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

      // Generate QR code image URL
      const qrCode = await QRCode.toDataURL(qrCodeDataJson);

      // Create ticket detail object
      const ticketDetail = {
        ticket: ticketId,
        name: ticket.name,
        price: ticket.price,
        quantity: quantity,
        qrCode: qrCode,
        purchaseDate: new Date(),
      };

      // Update order with ticket details
      order.tickets.push({
        ticket: ticketId,
        quantity: 1,
        validity: {
          startDate: validityStartDate,
          endDate: validityEndDate,
          startTime: validityStartTime,
          endTime: validityEndTime,
        },
        qrCode: qrCode,
        isDiscounted: ticket.priceCategory.isDiscounted,
        purchaseDate: new Date(),
        // Save additional ticket details to the order document
        additionalDetails: {
          qrCode: qrCode,
          // Add more details as needed
        },
      });

      // Save additional ticket details to the database
      await order.save();

      // Add ticket detail to the array for email
      ticketDetails.push(ticketDetail);
    }

    // Commit the transaction in the database
    await session.commitTransaction();
    session.endSession();

    // Create a customer in Stripe
    const customer = await stripeClient.customers.create({
      email: participantDetails.email,
      name: `${participantDetails.firstname} ${participantDetails.lastname}`,
      metadata: {
        ip_address: req.ip,
      },
    });

    // Determine currency based on the ticket or default to "usd"
    const currency = ticket ? ticket.currency.toLowerCase() : "usd";
    const sessionOptions = {
      payment_method_types: ["card", "klarna"],
      customer: customer.id,
      payment_method: paymentMethod,
      metadata: {
        // Add your metadata here if needed
      },
      confirm: true,
      //setup_future_usage: "off_session",
      return_url: "https://your-website.com/success", // Add your success URL here
    };
    // Create a payment intent with Stripe
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: Math.round(totalAmount * 100),
      currency,
      confirm: true,
      customer: customer.id,
      payment_method: paymentMethod,
      ...sessionOptions,
      metadata: {
        orderId: order.id, // This is setting the orderId in the metadata
      },
    });
    // Add the order creation request to the queue

    // Return success response with order details
    return res.status(201).json({
      message: "Order created successfully",
      clientSecret: paymentIntent.client_secret,
      //ticketDetails: ticketDetails,
    });
  } catch (error) {
    try {
      // If an error occurs, abort the transaction in the database
      await session.abortTransaction();
    } catch (abortError) {
      console.error("Error aborting transaction:", abortError);
    } finally {
      // End the MongoDB session
      session.endSession();
    }

    // Return error response
    return res
      .status(500)
      .json({ error: `Order creation failed: ${error.message}` });
  }
};

// Function to handle successful payment webhook events

export const handlePaymentSuccessWebhook = async (request, response, event) => {
  if (event.type === "payment_intent.succeeded") {
    try {
      const orderId = event.data.object.metadata.orderId;

      // Log the initial order status
      console.log("Initial Order Status:", await Order.findById(orderId));

      const order = await Order.findById(orderId)
        .populate("event")
        .populate("tickets.ticket");

      if (!order) {
        console.error("Order not found");
        return response.status(404).send("Order not found");
      }

      if (order.isPaid) {
        console.log("Order is already paid");
        return response.json({ received: true });
      }

      let totalAmount = 0;
      let totalQuantity = 0;

      // Your existing logic to update remainingTickets and soldOut in the database
      for (const orderTicket of order.tickets) {
        const ticketId = orderTicket.ticket._id;
        const quantity = orderTicket.quantity;

        // Find the ticket in the database
        const ticket = await Ticket.findById(ticketId);

        if (ticket) {
          ticket.displayOptions.remainingTickets -= quantity;

          if (ticket.displayOptions.remainingTickets <= 0) {
            ticket.displayOptions.remainingTickets = 0;
            ticket.displayOptions.soldOut = true;
          }

          // Save the updated ticket to the database
          await ticket.save();

          // Update totalQuantity and totalAmount
          totalQuantity += quantity;
          totalAmount += ticket.price * quantity;
        }
      }

      // Update order status asynchronously
      await Order.findByIdAndUpdate(orderId, {
        $set: {
          isPaid: true,
          paymentDetails: {
            method: "stripe",
            transactionId: event.data.object.id,
            totalAmount: totalAmount,
            status: "succeeded",
          },
        },
      });

      // Log the updated order status
      console.log("Updated Order Status:", await Order.findById(orderId));

      // Your existing logic to send payment success email
      await sendPaymentEmail({
        customerEmail: order.participantDetails.email,
        totalAmount: totalAmount,
        currency: order.tickets[0].ticket.currency,
        email: order.participantDetails.email,
        transactionId: event.data.object.id,
        totalQuantity: totalQuantity,
        orderCode: order.code,
        purchaseDate: order.createdAt,
        eventDetails: {
          eventName: order.event.eventName,
          location: order.event.location,
          startDate: order.event.startDate,
          startTime: order.event.startTime,
          endTime: order.event.endHour,
        },
        participantDetails: {
          firstname: order.participantDetails.firstname,
          lastname: order.participantDetails.lastname,
        },
        ticketDetails: order.tickets.map((orderTicket) => ({
          name: orderTicket.ticket.name,
          price: orderTicket.ticket.price,
          quantity: orderTicket.quantity,
          qrCode: orderTicket.qrCode, // Include qrCode in ticketDetails
          purchaseDate: orderTicket.purchaseDate, // Include purchaseDate in ticketDetails
        })),
      });

      console.log("Order and tickets updated successfully");

      // Send a response after handling the payment success event
      return response.json({ received: true });
    } catch (error) {
      console.error("Error handling payment success:", error);
      // If there's an error, send an internal server error response
      return response.status(500).send("Internal Server Error");
    }
  }

  // If the event type is not "payment_intent.succeeded", do not send a response here
};

// Function to create an order with PayPal
export const createOrderWithPayPal = async (req, res) => {
  const session = await mongoose.startSession({
    defaultTransactionOptions: {
      readConcern: { level: "snapshot" },
      writeConcern: { w: "majority" },
    },
    expire: 3600000,
  });
  session.startTransaction();

  const {
    eventId,
    items,
    participantDetails,
    validityStartDate,
    validityEndDate,
    validityStartTime,
    validityEndTime,
  } = req.body;
  try {
    const event = await Event.findById(eventId).session(session);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    let totalAmount = 0;
    const orderData = {
      event: eventId,
      isPaid: false,
      participantDetails: participantDetails,
      tickets: [],
    };

    if (req.user) {
      orderData.user = req.user.id;
    }

    const order = new Order(orderData);

    const qrCodes = [];
    let ticket;

    for (const item of items) {
      const { ticketId, quantity } = item;
      ticket = await Ticket.findById(ticketId).session(session);

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

        order.tickets.push({
          ticket: ticketId,
          quantity: 1,
          qrCode: url,
          isDiscounted: isDiscounted,
          purchaseDate: new Date(),
          validity: {
            startDate: validityStartDate,
            endDate: validityEndDate,
            startTime: validityStartTime,
            endTime: validityEndTime,
          },
        });
      }
    }

    const currency = ticket.currency.toUpperCase();

    const createPayment = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "http://yourwebsite.com/success",
        cancel_url: "http://yourwebsite.com/cancel",
      },
      transactions: [
        {
          amount: {
            total: totalAmount.toFixed(2),
            currency_code: currency,
          },
          description: "Event Tickets Purchase",
        },
      ],
    };

    console.log("we got this far");

    paypal.payment.create(createPayment, async (error, payment) => {
      if (error) {
        console.error("PayPal payment error:", error);
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ error: "PayPal payment failed" });
      } else {
        console.log("PayPal payment success:", payment);
        for (const link of payment.links) {
          if (link.method === "REDIRECT") {
            order.paymentDetails = {
              method: "PayPal",
              transactionId: payment.id,
              status: "Pending",
              totalAmount: totalAmount,
              promoCode: "",
            };
            await order.save();

            return res.json({ approval_url: link.href });
          }
        }
        return res.status(400).json({ error: "PayPal approval URL not found" });
      }
    });

    
    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

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
export const handlePayPalPaymentSuccessWebhook = async (req, res, event) => {
  if (event.event_type === "PAYMENTS.PAYMENT.CREATED") {
    try {
      const paymentId = event.resource.id;

      // Retrieve the order from the database based on the payment ID or any other relevant identifier
      const order = await Order.findOne({
        "paymentDetails.transactionId": paymentId,
      })
        .populate("event")
        .populate("tickets.ticket");

      if (!order) {
        console.error("Order not found");
        return res.status(404).send("Order not found");
      }

      if (order.isPaid) {
        console.log("Order is already paid");
        return res.json({ received: true });
      }

      let totalAmount = 0;
      let totalQuantity = 0;

      // Your existing logic to update remainingTickets and soldOut in the database
      for (const orderTicket of order.tickets) {
        const ticketId = orderTicket.ticket._id;
        const quantity = orderTicket.quantity;

        // Find the ticket in the database
        const ticket = await Ticket.findById(ticketId);

        if (ticket) {
          ticket.displayOptions.remainingTickets -= quantity;

          if (ticket.displayOptions.remainingTickets <= 0) {
            ticket.displayOptions.remainingTickets = 0;
            ticket.displayOptions.soldOut = true;
          }

          // Save the updated ticket to the database
          await ticket.save();

          // Update totalQuantity and totalAmount
          totalQuantity += quantity;
          totalAmount += ticket.price * quantity;
        }
      }

      // Update order status asynchronously
      await Order.findByIdAndUpdate(order._id, {
        $set: {
          isPaid: true,
          paymentDetails: {
            method: "PayPal",
            transactionId: paymentId,
            totalAmount: totalAmount,
            status: "Paid", // You may need to adjust the status based on PayPal webhook events
          },
        },
      });

      // Log some data to help with debugging
      console.log("Order and tickets updated successfully");
      console.log("Order Data:", order);
      console.log("Total Amount:", totalAmount);
      console.log("Total Quantity:", totalQuantity);

      // Your existing logic to send payment success email
      await sendPaymentEmail({
        order,
        ticketDetails: order.tickets.map((orderTicket) => ({
          name: orderTicket.ticket.name,
          price: orderTicket.ticket.price,
          quantity: orderTicket.quantity,
          qrCode: orderTicket.qrCode, // Include qrCode in ticketDetails
          purchaseDate: orderTicket.purchaseDate, // Include purchaseDate in ticketDetails
        })),
      });

      console.log("Email sent successfully");

      // Send a single response to the client
      res.json({ received: true });
    } catch (error) {
      console.error("Error handling PayPal payment success:", error);
      return res.status(500).send("Internal Server Error");
    }
  } else {
    // Handle other webhook events if needed
    console.log("Unhandled PayPal webhook event:", event.event_type);
    res.json({ received: true });
  }
};

// Define a function to handle downloading a single ticket
export const downloadTicketHandler = async (req, res) => {
  const { orderId, ticketId } = req.params;

  try {
    const order = await Order.findById(orderId)
      .populate("event")
      .populate("tickets.ticket");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Check if the specified ticketId exists in the order
    const orderTicket = order.tickets.find(
      (t) => t.ticket._id.toString() === ticketId
    );

    if (!orderTicket) {
      return res.status(404).json({ error: "Ticket not found in the order" });
    }

    // Prepare data for the PDF
    const pdfData = {
      customerEmail: order.participantDetails.email,
      email: order.participantDetails.email,
      orderCode: order.code,
      eventDetails: {
        eventName: order.event.eventName,
        location: order.event.location,
        startDate: order.event.startDate,
        startTime: order.event.startTime,
        endTime: order.event.endHour,
      },
      participantDetails: {
        firstname: order.participantDetails.firstname,
        lastname: order.participantDetails.lastname,
      },
      ticketDetails: {
        qrCode: orderTicket.qrCode,
        name: orderTicket.ticket.name,
        price: orderTicket.ticket.price,
        quantity: orderTicket.quantity,
        purchaseDate: orderTicket.purchaseDate,
      },
    };

    // Read the ticket template
    const ticketTemplateSource = fs.readFileSync(
      path.join(__dirname, "../public/templates/ticket.hbs"),
      "utf8"
    );

    // Generate the PDF content using a template
    const pdfContent = ticketTemplateSource.replace(
      /{{\s*([\w.-]+)\s*}}/g,
      (match, placeholder) => {
        switch (placeholder) {
          case "firstname":
            return pdfData.participantDetails.firstname;
          case "lastname":
            return pdfData.participantDetails.lastname;
          case "email":
            return pdfData.participantDetails.email;
          case "orderCode":
            return pdfData.orderCode;
          case "eventName":
            return pdfData.eventDetails.eventName;
          case "startDate":
            const startDate = new Date(pdfData.eventDetails.startDate);
            const formattedStartDate = `${startDate.getDate()}.${
              startDate.getMonth() + 1
            }.${startDate.getFullYear()}`;
            return formattedStartDate;
          case "startTime":
            return pdfData.eventDetails.startTime;
          case "EventendTime":
            return pdfData.eventDetails.endTime;
          case "qrcode":
            return pdfData.ticketDetails.qrCode;
          default:
            return match;
        }
      }
    );

    // Launch puppeteer and generate PDF
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(pdfContent);
    const pdfBuffer = await page.pdf({ format: "Letter" });
    await browser.close();

    // Set response headers for file download
    res.setHeader("Content-Type", "application/pdf");
    const fileName = `ticket_${ticketId}_${orderId}.pdf`;
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

    // Send the PDF buffer as the response
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Define a function to handle downloading all tickets

export const downloadAllTicketsHandler = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId)
      .populate("event")
      .populate("tickets.ticket");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Create a temporary directory for storing PDF files
    const tempDir = path.join(__dirname, "../temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    // Generate and save each PDF file
    const pdfPaths = [];
    for (const orderTicket of order.tickets) {
      const pdfData = {
        customerEmail: order.participantDetails.email,
        email: order.participantDetails.email,
        orderCode: order.code,
        eventDetails: {
          eventName: order.event.eventName,
          location: order.event.location,
          startDate: order.event.startDate,
          startTime: order.event.startTime,
          endTime: order.event.endHour,
        },
        participantDetails: {
          firstname: order.participantDetails.firstname,
          lastname: order.participantDetails.lastname,
        },
        ticketDetails: {
          name: orderTicket.ticket.name,
          price: orderTicket.ticket.price,
          quantity: orderTicket.quantity,
          qrCode: orderTicket.qrCode,
          purchaseDate: orderTicket.purchaseDate,
        },
      };

      const ticketTemplateSource = fs.readFileSync(
        path.join(__dirname, "../public/templates/ticket.hbs"),
        "utf8"
      );

      const pdfContent = ticketTemplateSource.replace(
        /{{\s*([\w.-]+)\s*}}/g,
        (match, placeholder) => {
          switch (placeholder) {
            case "firstname":
              return pdfData.participantDetails.firstname;
            case "lastname":
              return pdfData.participantDetails.lastname;
            case "email":
              return pdfData.participantDetails.email;
            case "orderCode":
              return pdfData.orderCode;
            case "eventName":
              return pdfData.eventDetails.eventName;
            case "startDate":
              const startDate = new Date(pdfData.eventDetails.startDate);
              const formattedStartDate = `${startDate.getDate()}.${
                startDate.getMonth() + 1
              }.${startDate.getFullYear()}`;
              return formattedStartDate;
            case "startTime":
              return pdfData.eventDetails.startTime;
            case "EventendTime":
              return pdfData.eventDetails.endTime;
            case "qrcode":
              return pdfData.ticketDetails.qrCode;
            default:
              return match;
          }
        }
      );

      const pdfPath = path.join(tempDir, `ticket_${orderTicket._id}.pdf`);
      pdfPaths.push(pdfPath);

      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setContent(pdfContent);
      await page.pdf({ path: pdfPath, format: "A4" });
      await browser.close();
    }

    // Create a zip file and add all PDF files to it
    const zipPath = path.join(tempDir, `all_tickets_${orderId}.zip`);
    const outputZip = fs.createWriteStream(zipPath);
    const archive = archiver("zip", {
      zlib: { level: 9 }, // Sets the compression level
    });

    outputZip.on("close", () => {
      // Send the zip file as the response
      res.download(zipPath, `all_tickets_${orderId}.zip`, (err) => {
        // Delete temporary files and directory
        pdfPaths.forEach((pdfPath) => {
          fs.unlinkSync(pdfPath);
        });
        fs.rmdirSync(tempDir);
      });
    });

    archive.on("error", (err) => {
      console.error("Error creating zip file:", err);
      res.status(500).json({ error: "Internal Server Error" });
    });

    archive.pipe(outputZip);
    pdfPaths.forEach((pdfPath) => {
      archive.append(fs.createReadStream(pdfPath), {
        name: path.basename(pdfPath),
      });
    });
    archive.finalize();
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ error: "Internal Server Error" });
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
