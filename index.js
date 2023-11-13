import app from "./src/app.js";
import dotenv from "dotenv";
import express from "express";
import { connectDatabase } from "./src/database/database.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

/* Accessing .env content */
dotenv.config();

/* Defining server's HOSTNAME & PORT */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const hostname = process.env.HOSTNAME;
const port = process.env.PORT;

// Serve the specific file at .well-known/apple-developer-merchantid-domain-association
app.use("/.well-known", express.static(__dirname + "/.well-known"));
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (request, response) => {
    let event = request.body;
    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    if (endpointSecret) {
      // Get the signature sent by Stripe
      const signature = request.headers["stripe-signature"];
      try {
        event = stripe.webhooks.constructEvent(
          request.body,
          signature,
          endpointSecret
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return response.sendStatus(400);
      }
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        console.log(
          `PaymentIntent for ${paymentIntent.amount} was successful!`
        );
        // Then define and call a method to handle the successful payment intent.
        // handlePaymentIntentSucceeded(paymentIntent);
        break;
      case "payment_method.attached":
        const paymentMethod = event.data.object;
        // Then define and call a method to handle the successful attachment of a PaymentMethod.
        // handlePaymentMethodAttached(paymentMethod);
        break;
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}.`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);
/* Connecting to the server */
connectDatabase()
  .then(() => {
    app.get("/", (req, res) => {
      res.send("E-tickets project is running...");
    });

    app.listen(port, () => {
      console.log(`Listening [http://${hostname}:${port}]...`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });
