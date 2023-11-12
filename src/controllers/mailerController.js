import emailjs from "@emailjs/nodejs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import dotenv from "dotenv";
/* Accessing .env content */
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create a Nodemailer transporter using the provided email configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendStripePaymentEmail = (data) => {
  return new Promise((resolve, reject) => {
    const {
      customerEmail,
      totalAmount,
      totalQuantity,
      currency,
      email,
      transactionId,
      orderCode,
      purchaseDate,
      eventDetails,
      participantDetails,
      ticketDetails, // Include the ticket details data
    } = data;
    // Format the ticket details into a string
    const ticketDetailsContent = ticketDetails.map((ticketDetail, index) => {
      return `
    <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 10px; background-color: #f9f9f9;">
      <p style="font-weight: bold;">Ticket #${index + 1}</p>
      <p>Ticketname: ${ticketDetail.name}</p>
      <p>Ticket Preis: ${ticketDetail.price}</p>
      <p>Menge: ${ticketDetail.quantity}</p>
    </div>
  `;
    });

    const ticketDetailsHTML = ticketDetailsContent.join(""); // No extra line breaks


    // Load your email template
    const emailTemplateSource = fs.readFileSync(
      path.join(__dirname, "../public/templates/email.hbs"),
      "utf8"
    );

    // Define a regular expression to match all occurrences of placeholders
    const placeholderRegExp = /{{\s*([\w.-]+)\s*}}/g;

    // Replace all occurrences of placeholders in the email template with the provided data
    const replacedEmailContent = emailTemplateSource.replace(
      placeholderRegExp,
      (match, placeholder) => {
        switch (placeholder) {
          case "firstname":
            return participantDetails.firstname;
          case "lastname":
            return participantDetails.lastname;
          case "totalAmount":
            return totalAmount;
          case "currency":
            return currency;
          case "email":
            return email;
          case "transactionId":
            return transactionId;
          case "orderCode":
            return orderCode;
          case "eventName":
            return eventDetails.eventName;
          case "startDate":
            // Format the date as "09.03.2024"
            const startDate = new Date(eventDetails.startDate);
            const formattedStartDate = `${startDate.getDate()}.${
              startDate.getMonth() + 1
            }.${startDate.getFullYear()}`;
            return formattedStartDate;
          case "startTime":
            return eventDetails.startTime;
          case "EventendTime":
            return eventDetails.endTime;
          case "totalQuantity":
            return totalQuantity;
          case "eventLocation":
            return eventDetails.location;
          case "purchaseDate":
            return purchaseDate;
          case "ticketInfo":
            // Handle the ticketInfo data
            return ticketDetailsHTML; // Use the formatted stringstring with line breaks
          default:
            return match; // Keep the original placeholder if not recognized
        }
      }
    );

    const mailOptions = {
      from: "no-reply@my-eticket.de",
      to: customerEmail,
      subject: "Payment Confirmation",
      html: replacedEmailContent, // Use HTML instead of text
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        reject(error);
      } else {
        console.log("Email sent:", info.response);
        resolve(info.response);
      }
    });
  });
};

// Function to generate a random verification token
export const generateRandomToken = () => {
  // Generate a random 32-byte token
  const token = crypto.randomBytes(32).toString("hex");
  return token;
};

// Function to send a verification email
export const sendVerificationEmail = async (user) => {
  try {
    // Generate a verification token and set expiration (e.g., 24 hours from now)
    const verificationToken = generateRandomToken();
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 2); // Set expiration to 2 hours from now

    // Save the verification token and expiration date in the user document
    user.verificationToken = verificationToken;
    user.verificationTokenExpires = expirationDate;
    await user.save();

    // Create the templateParams for the email
    const templateParams = {
      name: user.firstname,
      email: user.email,
      verificationLink: `http://127.0.0.1:9090/auth/verify/${verificationToken}`,
    };

    // Send the verification email using emailjs
    const emailResponse = await emailjs.send(
      process.env.SERVICE_ID,
      process.env.TEMPLATE_ID,
      templateParams,
      {
        publicKey: process.env.PUBLIC_KEY,
        privateKey: process.env.PRIVATE_KEY, // optional, highly recommended for security reasons
      }
    );

    // Log the emailResponse before returning it
    console.log("Email Response:", emailResponse);

    // Handle the email send response
    if (emailResponse.status === 200) {
      // Email sent successfully
      return {
        success: true,
        message: "Verification email sent successfully.",
      };
    } else {
      // Email send failed, so throw an error
      throw new Error("Failed to send verification email.");
    }
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error; // Throw an error when email sending fails
  }
};

/**RESET PASSWORD EMAIL*/
export const sendPasswordResetEmail = async (user) => {
  try {
    // Generate a password reset token
    const resetToken = generateRandomToken();

    // Set an expiration date for the token (e.g., 1-2 hours from now)
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 2); // Set expiration to 2 hours from now

    // Save the reset token and expiration date in the user document
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = expirationDate;
    await user.save();

    // Create the templateParams for the email
    const templateParams = {
      name: user.firstname,
      email: user.email,

      //chnaged from 127.0.0.1:9090 to localhost
      resetLink: `http://localhost/auth/reset-password/${resetToken}`,
    };

    // Send the password reset email using the email service (e.g., emailjs)
    const emailResponse = await emailjs.send(
      process.env.SERVICE_ID,
      process.env.RESET_TEMPLATE_ID,
      templateParams,
      {
        publicKey: process.env.PUBLIC_KEY,
        privateKey: process.env.PRIVATE_KEY, // optional, recommended for security
      }
    );

    if (emailResponse.status === 200) {
      return {
        success: true,
        message: "Password reset email sent successfully.",
      };
    } else {
      return {
        success: false,
        message: "Failed to send password reset email.",
      };
    }
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return { success: false, message: "Internal server error." };
  }
};
