import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import ms from "ms";
import { sendPasswordResetEmail } from "./mailerController.js";
import dotenv from "dotenv";

/* Accessing ..env content */
dotenv.config();

// Function to sign JWT tokens
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: ms(process.env.JWT_COOKIE_EXPIRES_IN),
  });
};

// Login handler
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    // Find the user by email
    const user = await User.findOne({ email });

    // If the user doesn't exist, return an error
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if the provided password matches the user's hashed password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    // If the password is incorrect, return an error
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Sign a JWT token
    const token = signToken(user._id);

    // Convert the JWT cookie expiration timespan to seconds using 'ms'
    const expiresInMilliseconds = ms(process.env.JWT_COOKIE_EXPIRES_IN);
    console.log("Token Created At:", new Date(Date.now()));
    console.log(
      "Token Expires At:",
      new Date(Date.now() + expiresInMilliseconds)
    );

    // Set the token in a cookie
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + expiresInMilliseconds),
      httpOnly: true,
    });

    // Define a user data object
    const userData = {
      id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
    };

    // Conditionally include organizer's information if the user is an organizer
    if (user.role === "organizer") {
      userData.organizerInfo = user.organizerInfo;
    }

    // Return user data along with the token
    return res.status(200).json({
      user: userData,
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    // Extract the verification token from the request
    const verificationToken = req.params.token;

    // Find the user with the matching verification token
    const user = await User.findOne({ verificationToken });

    // Set a default message for verification
    let message = "Email verification failed.";

    // If a user is found and not already verified
    if (user && !user.isVerified) {
      // Set the user's isVerified field to true and remove the verification token
      user.isVerified = true;
      user.verificationToken = undefined;
      await user.save();

      // Update the message for successful verification
      message = "Email verification successful, you can login in now .";
    }

    // Redirect to the home page (adjust the URL as needed)
    const homePageURL = "http://localhost"; // Modify this with your actual home page URL
    const redirectURL = `${homePageURL}/?message=${encodeURIComponent(
      message
    )}`;
    return res.redirect(redirectURL);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "failure", message: "Email verification failed." });
  }
};

export const resetPassword = async (req, res) => {
  try {
    // Extract the reset token from the URL
    const resetToken = req.params.token;

    // Find the user with the matching reset token
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    // If no user found or reset token has expired, return an error
    if (!user) {
      return res
        .status(400)
        .json({ error: "Invalid or expired password reset token." });
    }

    // Extract the new password from the request body
    const { newPassword } = req.body;

    // Reset the user's password and clear the reset token fields
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    // Hash and save the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;

    // Save the updated user document
    await user.save();

    // Respond with a success message
    res.status(200).json({ message: "Password reset successful." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Password reset failed." });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    // Find the user by email
    const { email } = req.body;
    const user = await User.findOne({ email });

    // If no user found, return an error
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Send a password reset email
    const emailResult = await sendPasswordResetEmail(user);

    // Handle email send response
    if (emailResult.success) {
      return res
        .status(200)
        .json({ message: "Password reset email sent successfully." });
    } else {
      return res
        .status(500)
        .json({ error: "Failed to send password reset email." });
    }
  } catch (error) {
    console.error("Error initiating password reset:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

//logout handler
export const logout = (req, res) => {
  try {
    // Clear the JWT cookie by setting it to an empty string and expiring it immediately
    res.cookie("jwt", "", {
      expires: new Date(0),
      httpOnly: true,
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
