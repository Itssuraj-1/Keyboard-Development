import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ApiResponse from "../utils/apiResponse.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return ApiResponse.error(res, 401, "User not found");
      }

      next();
    } catch (error) {
      console.error("Auth middleware error:", error);
      return ApiResponse.error(res, 401, "Not authorized, token failed");
    }
  }

  if (!token) {
    return ApiResponse.error(res, 401, "Not authorized, no token");
  }
};

export const optionalAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
    } catch (error) {
      // Token invalid but continue anyway
      req.user = null;
    }
  }

  next();
};
