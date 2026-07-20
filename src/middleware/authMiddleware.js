import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config/jwt.js";
import { errorResponse } from "../utils/apiResponse.js";
import { MESSAGES } from "../constants/messages.js";

/**
 * Authentication Middleware
 */

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return errorResponse(res, 401, MESSAGES.UNAUTHORIZED);
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    return errorResponse(res, 401, MESSAGES.INVALID_TOKEN);
  }
};

export default authMiddleware;
