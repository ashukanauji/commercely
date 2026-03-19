import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

const extractToken = (authorizationHeader = "") => {
  if (!authorizationHeader) return null;
  if (authorizationHeader.startsWith("Bearer ")) {
    return authorizationHeader.slice(7);
  }
  return authorizationHeader;
};

export const requireSignIn = async (req, res, next) => {
  try {
    const token = extractToken(req.headers.authorization);

    if (!token) {
      return res.status(401).send({
        success: false,
        message: "Authorization token is required",
      });
    }

    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).send({
      success: false,
      message: "Invalid or expired token",
      error: error.message,
    });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id).select("role");

    if (!user || user.role !== 1) {
      return res.status(403).send({
        success: false,
        message: "Unauthorized access",
      });
    }

    next();
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error validating admin access",
      error: error.message,
    });
  }
};
