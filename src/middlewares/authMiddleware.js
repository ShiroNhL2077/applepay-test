import jwt from "jsonwebtoken";
import { promisify } from "util";
import User from "../models/User.js";
import dotenv from "dotenv";

/* Accessing ..env content */
dotenv.config();


export const protect = async (req, res, next) => {
  try {
    let token;

    // Check if the request contains a token in the headers, cookies, or query string
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    // If no token is found, return an error
    if (!token) {
      return res.status(401).json({ message: "You are not logged in" });
    }

    // Verify the token and extract the user's ID
    //const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    if (decoded.exp * 1000 < Date.now()) {
      return res
        .status(401)
        .json({ message: "Token has expired. Please login again" });
    }

    // Fetch the user by ID
    const user = await User.findById(decoded.id);

    // Attach the user and role to the request object
    req.user = user;
    req.role = user.role;

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid token. Please login again" });
  }
};

export const restrictToAdmin = (req, res, next) => {
  // Check if the user is an admin
  if (req.user && req.user.role === "admin") {
    // User is an admin, allow access to the next middleware or route handler
    next();
  } else {
    // User is not an admin, return an error response
    return res
      .status(403)
      .json({ message: "Access denied. Admin access required." });
  }
};
