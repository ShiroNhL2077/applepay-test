import User from "../models/User.js";
import { sendVerificationEmail } from "./mailerController.js";
import bcrypt from "bcrypt";

export const registerBuyer = async (req, res) => {
  try {
    // Extract buyer registration data from the request body
    const { firstname, lastname, email, password } = req.body;

    // Check if the email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash the password using bcrypt
    const saltRounds = 10; // You can adjust the number of salt rounds for security
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user document with role "buyer" and isVerified set to false
    const newUser = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword, // Store the hashed password
      role: "buyer",
    });

    // Log the user object to check if it's created correctly
    console.log("New User:", newUser);

    // Send the verification email
    const emailResult = await sendVerificationEmail(newUser); // Pass the user object to the sendVerificationEmail function

    // Log the emailResult to see its content
    console.log("Email Result:", emailResult);

    // Check if the email was sent successfully
    if (emailResult.success) {
      // Save the user document to the database
      await newUser.save();

      // Respond with a success message
      return res.status(201).json({
        message:
          "Registration successful. Please check your email for verification.",
      });
    } else {
      // Email sending failed, so respond with an error message
      console.log("Email Sending Failed");
      return res.status(500).json({ error: "Email sending failed." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Registration failed." });
  }
};
