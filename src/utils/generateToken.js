import jwt from "jsonwebtoken";

import { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY } from "../config/jwt.js";

/**
 * Generate Access Token
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    ACCESS_TOKEN_SECRET,
    {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    },
  );
};

export default generateToken;
