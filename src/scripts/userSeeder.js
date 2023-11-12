import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { connectDatabase } from "../database/database.js";

// Connect to the database using connectDatabase
connectDatabase()
  .then(async () => {
    try {
      // Create test users with hashed passwords
      const users = [
        {
          firstname: "Eventausstattung",
          lastname: "Richter",
          username: "EventausstattungRichter",
          password: await bcrypt.hash("EventausstattungRichter", 10), // Hashed password
          email: "EventausstattungRichter@e-ticket.com",
          role: "admin",
          birthdate: new Date("1990-01-01"),
        },
        /*{
          firstname: "Alice",
          lastname: "Smith",
          username: "alice_smith",
          password: await bcrypt.hash("password456", 10), // Hashed password
          email: "alice@example.com",
          role: "organizer",
          birthdate: new Date("1985-05-15"),
          organizerInfo: {
            isProfessional: true, // Modify this value as needed
            organizationName: "Sample Organization", // Modify this value as needed
            document: "sample-document.pdf", // Modify this value as needed
            isApproved: true, // Modify this value as needed
          },
        },
        {
          firstname: "Bob",
          lastname: "Johnson",
          username: "bob_johnson",
          password: await bcrypt.hash("password789", 10), // Hashed password
          email: "bob@example.com",
          role: "buyer",
          birthdate: new Date("1995-03-20"),
        },
        {
          firstname: "Eve",
          lastname: "Anderson",
          username: "eve_anderson",
          password: await bcrypt.hash("passwordabc", 10), // Hashed password
          email: "eve@example.com",
          role: "securityAgent",
          birthdate: new Date("1980-12-10"),
        },

        {
          firstname: "Mike",
          lastname: "Brown",
          username: "mike_brown",
          password: await bcrypt.hash("passwordqrs", 10), // Hashed password
          email: "mike@example.com",
          role: "reseller",
          birthdate: new Date("1980-03-15"),
        },*/
      ];

      for (const user of users) {
        await User.create(user);
      }

      console.log("Test users inserted successfully.");

      // Close the database connection
      mongoose.connection.close();
    } catch (error) {
      console.error("Error seeding users:", error);
      mongoose.connection.close();
    }
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
  });