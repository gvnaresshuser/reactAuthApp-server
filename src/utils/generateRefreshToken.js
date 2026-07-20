import jwt from "jsonwebtoken";

import { REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY } from "../config/jwt.js";

/**
 * Generate Refresh Token
 */

const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
    },
    REFRESH_TOKEN_SECRET,
    {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    },
  );
};

export default generateRefreshToken;
