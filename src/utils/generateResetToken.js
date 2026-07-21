import crypto from "crypto";
import bcrypt from "bcrypt";
import SALT_ROUNDS from "../config/security.js";

/**
 * Generate Secure Password Reset Token
 */
const generateResetToken = async () => {
  // Plain token (sent to user via email)
  const token = crypto.randomBytes(32).toString("hex");

  // Store only the hash in DB
  const tokenHash = await bcrypt.hash(token, SALT_ROUNDS);

  // Expire in 15 minutes
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 15);

  return {
    token,
    tokenHash,
    expiresAt,
  };
};

export default generateResetToken;
