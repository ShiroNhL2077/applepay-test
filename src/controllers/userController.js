import User from "../models/User.js";
import bcrypt from "bcrypt";

export const updateUserProfile = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      newPassword,
      phone, // Add phone field
      country, // Add country field
      address, // Add address field
    } = req.body;

    const userId = req.user.id;
    const user = await User.findById(userId);

    // Check and update user details
    if (firstname && user.firstname !== firstname) {
      user.firstname = firstname;
    }
    if (lastname && user.lastname !== lastname) {
      user.lastname = lastname;
    }
    if (newPassword && user.password !== newPassword) {
      // Hash the new password before updating
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      user.password = hashedPassword;
    }

    // Update additional fields
    if (phone) {
      user.phone = phone;
    }
    if (country) {
      user.country = country;
    }
    if (address) {
      user.address = address;
    }

    await user.save();

    res.status(200).json({ message: "User profile updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
