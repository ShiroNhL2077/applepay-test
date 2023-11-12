import User from "../models/User.js";
import { sendVerificationEmail } from "./mailerController.js";

export const registerOrganizer = async (req, res) => {
  try {
    // Extract organizer registration data from the request body
    const {
      firstname,
      lastname,
      email,
      password,
      organizationName, // Optional
    } = req.body;

    // Create a new user document with role "organizer" and isVerified set to false
    const newUser = new User({
      firstname,
      lastname,
      email,
      password,
      role: "organizer",
      isVerified: false, // Not verified until email confirmation
      organizerInfo: {
        isProfessional: false,
        organizationName, // Optional
        isApproved: false,
      },
    });

    // Save the user document to the database
    await newUser.save();

    // Send the verification email
    await sendVerificationEmail(newUser); // Pass the user object to the sendVerificationEmail function

    // Respond with a success message
    res.status(201).json({
      message:
        "Registration successful. Please check your email for verification.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Registration failed." });
  }
};
