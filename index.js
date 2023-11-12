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
