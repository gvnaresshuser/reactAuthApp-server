import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import { MESSAGES } from "../constants/messages.js";
import {
  findUserByEmail,
  createUser,
  findUserById,
  updateProfile,
  updatePassword,
  findUserWithPasswordById,
} from "../repositories/userRepository.js";
import {
  createRefreshToken,
  deleteAllRefreshTokens,
  findRefreshTokensByUserId,
  deleteRefreshToken,
  deleteExpiredRefreshTokens,
} from "../repositories/refreshTokenRepository.js";
import SALT_ROUNDS from "../config/security.js";
import jwt from "jsonwebtoken";

import verifyRefreshToken from "../utils/verifyRefreshToken.js";

import generateResetToken from "../utils/generateResetToken.js";
import {
  createPasswordResetToken,
  deleteAllPasswordResetTokens,
} from "../repositories/passwordResetRepository.js";
import sendMail from "../utils/sendMail.js";
import {
  findAllPasswordResetTokens,
  deletePasswordResetToken,
} from "../repositories/passwordResetRepository.js";
import getTokenExpiryDate from "../utils/getTokenExpiryDate.js";
export const registerService = async (fullName, email, password) => {
  // Check existing user
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error(MESSAGES.EMAIL_ALREADY_EXISTS);
  }
  // Hash password
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  //-----------------
  console.log("Register Password:", password);
  console.log("Generated Hash:", hashedPassword);

  const test = await bcrypt.compare(password, hashedPassword);
  console.log("Immediate Compare:", test);
  //-----------------
  // Create user
  const user = await createUser(fullName, email, hashedPassword);
  return user;
};

export const loginService = async (email, password) => {
  console.log("Login Email :", email);

  const user = await findUserByEmail(email);

  console.log("User :", user);

  if (!user) {
    console.log("User not found");
    throw new Error(MESSAGES.INVALID_CREDENTIALS);
  }

  console.log("Entered Password :", password);
  console.log("DB Password :", user.password);

  const isPasswordValid = await bcrypt.compare(password, user.password);

  console.log("Password Match :", isPasswordValid);

  if (!isPasswordValid) {
    throw new Error(MESSAGES.INVALID_CREDENTIALS);
  }
  const accessToken = generateToken(user);
  const refreshToken = generateRefreshToken(user);
  const refreshTokenHash = await bcrypt.hash(refreshToken, SALT_ROUNDS);
  ////const expiresAt = new Date();
  //const days = parseInt(process.env.REFRESH_TOKEN_EXPIRY, 10) || 7;
  //expiresAt.setDate(expiresAt.getDate() + days);
  
  ////const expiresAt = getTokenExpiryDate(process.env.REFRESH_TOKEN_EXPIRY);
console.log("Now:", new Date().toString());
console.log("Now ISO:", new Date().toISOString());

const expiresAt = getTokenExpiryDate(process.env.REFRESH_TOKEN_EXPIRY);

console.log("Expires:", expiresAt.toString());
console.log("Expires ISO:", expiresAt.toISOString());
  await createRefreshToken(user.id, refreshTokenHash, expiresAt);
  const userInfo = {
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    role: user.role,
    is_active: user.is_active,
  };
  return {
    user: userInfo,
    accessToken,
    refreshToken,
  };
};

export const profileService = async (userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new Error(MESSAGES.USER_NOT_FOUND);
  }

  return {
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    role: user.role,
    is_active: user.is_active,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
};

/**
 * Update Profile
 */

export const updateProfileService = async (userId, body) => {
  const { fullName } = body;
  const user = await findUserById(userId);
  if (!user) {
    throw new Error(MESSAGES.USER_NOT_FOUND);
  }
  return await updateProfile(userId, fullName);
};

/**
 * Change Password
 */

export const changePasswordService = async (userId, body) => {
  const { currentPassword, newPassword } = body;
  const user = await findUserWithPasswordById(userId);
  if (!user) {
    throw new Error(MESSAGES.USER_NOT_FOUND);
  }
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw new Error(MESSAGES.INVALID_CREDENTIALS);
  }
  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await updatePassword(userId, hashedPassword);
  // Invalidate all existing sessions
  await deleteAllRefreshTokens(userId);
  return;
};
export const refreshTokenService = async (refreshToken) => {
   console.log("SERVICE START");

   console.log("Token:", refreshToken);

  if (!refreshToken) {
    console.log("TOKEN IS NULL");
    throw new Error(MESSAGES.UNAUTHORIZED);
  }

  console.log("=================================");
  console.log("Incoming Refresh Token");
  console.log(refreshToken);


  let payload;

  try {
    await deleteExpiredRefreshTokens();
    // Verify JWT Signature & Expiry
    payload = verifyRefreshToken(refreshToken);
  } catch (err) {
    console.log("JWT Error:", err.name);
      console.log("**************");
      console.log("JWT Error:", err.name);
      console.log("JWT Message:", err.message);
      console.log("**************");

   /*  if (err.name === "TokenExpiredError") {
      const decoded = jwt.decode(refreshToken);

      console.log("Decoded:", decoded);

      if (decoded?.id) {
        const tokens = await findRefreshTokensByUserId(decoded.id);

        console.log("Tokens in DB:", tokens.length);

        for (const token of tokens) {
          const isMatch = await bcrypt.compare(refreshToken, token.token);

          console.log("Compare:", isMatch);

          if (isMatch) {
            console.log("Deleting Token ID:", token.id);

            await deleteRefreshToken(token.id);

            console.log("Deleted");

            break;
          }
        }
      }
    } */

    throw new Error(MESSAGES.UNAUTHORIZED);
  }

  // Find user
  const user = await findUserById(payload.id);

  if (!user) {
    throw new Error(MESSAGES.USER_NOT_FOUND);
  }

  // Find matching refresh token stored in DB
  const tokens = await findRefreshTokensByUserId(user.id);

    console.log("Tokens in DB:", tokens.length);


  let matchedToken = null;

for (const token of tokens) {
  console.log("---------------------------");
  console.log("DB Token ID:", token.id);
  console.log("DB Expires:", token.expires_at);

  const isMatch = await bcrypt.compare(refreshToken, token.token);

  console.log("Match:", isMatch);

  if (isMatch) {
    console.log("Matched Token:", token.id);

    matchedToken = token;
    break;
  }
}

  if (!matchedToken) {
    throw new Error(MESSAGES.UNAUTHORIZED);
  }

  // ===============================
  // Refresh Token Rotation
  // ===============================
console.log("Deleting:", matchedToken.id);

await deleteRefreshToken(matchedToken.id);

console.log("Deleted Successfully");


  const remaining = await findRefreshTokensByUserId(user.id);

  console.log("Remaining Tokens:", remaining);

  // Generate new access token
  const accessToken = generateToken(user);

  // Generate new refresh token
  const newRefreshToken = generateRefreshToken(user);

  // Hash refresh token before storing
  const refreshHash = await bcrypt.hash(newRefreshToken, SALT_ROUNDS);

  ////const expiresAt = getTokenExpiryDate(process.env.REFRESH_TOKEN_EXPIRY);
  console.log("ENV:", process.env.REFRESH_TOKEN_EXPIRY);

  const expiresAt = getTokenExpiryDate(process.env.REFRESH_TOKEN_EXPIRY);

  console.log("Expires At:", expiresAt);
  console.log("Now:", new Date());

  // Store new refresh token
  await createRefreshToken(user.id, refreshHash, expiresAt);

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};
export const logoutService = async (refreshToken) => {
  if (!refreshToken) {
    return;
  }

  let payload;

  try {
    await deleteExpiredRefreshTokens();
    payload = verifyRefreshToken(refreshToken);
  } catch (err) {
    // If refresh token expired, remove it from DB
    if (err.name === "TokenExpiredError") {
      const decoded = jwt.decode(refreshToken);

      if (decoded?.id) {
        const tokens = await findRefreshTokensByUserId(decoded.id);

        for (const token of tokens) {
          const isMatch = await bcrypt.compare(refreshToken, token.token);

          if (isMatch) {
            await deleteRefreshToken(token.id);
            break;
          }
        }
      }
    }

    return;
  }

  const tokens = await findRefreshTokensByUserId(payload.id);

  for (const token of tokens) {
    const isMatch = await bcrypt.compare(refreshToken, token.token);

    if (isMatch) {
      await deleteRefreshToken(token.id);
      break;
    }
  }
};
export const logoutAllDevicesService = async (userId) => {
  await deleteAllRefreshTokens(userId);
};

/**
 * Forgot Password
 */
export const forgotPasswordService = async (email) => {
  // Find user
  const user = await findUserByEmail(email);
  console.log("USER::", user);

  // Don't reveal whether email exists
  if (!user) {
    return;
  }

  // Remove previous reset tokens
  await deleteAllPasswordResetTokens(user.id);

  // Generate secure token
  const { token, tokenHash, expiresAt } = await generateResetToken();

  // Save hashed token
  await createPasswordResetToken(user.id, tokenHash, expiresAt);

  // Temporary (until email is implemented)
  /*  console.log("================================");
  console.log("PASSWORD RESET TOKEN");
  console.log(token);
  console.log("================================"); */
  //-----------------------
  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  console.log(resetLink);
  const html = `
<h2>Password Reset</h2>

<p>Hello <b>${user.full_name}</b>,</p>

<p>We received a request to reset your password.</p>

<p>
<a href="${resetLink}"  style="
    background:#2563eb;
    color:white;
    padding:12px 24px;
    text-decoration:none;
    border-radius:6px;
    display:inline-block;
    font-weight:bold;
  ">
Reset Password
</a>
</p>

<p>Or copy and paste this link:</p>

<p>${resetLink}</p>

<p>This link expires in 15 minutes.</p>

<p>If you didn't request this, simply ignore this email.</p>

<p>Regards,<br/>React Auth Team</p>
`;

  await sendMail({
    to: user.email,
    subject: "Reset Your Password",
    html,
  });
  //-----------------------

  return token;
};
/**
 * Reset Password
 */
export const resetPasswordService = async (token, newPassword) => {
  console.log("Incoming Token:", token);

  const tokens = await findAllPasswordResetTokens();

  console.log(tokens);

  let matchedToken = null;

  for (const item of tokens) {
    const isMatch = await bcrypt.compare(token, item.token_hash);

    if (isMatch) {
      matchedToken = item;
      break;
    }
  }

  console.log("Matched Token:", matchedToken);

  if (!matchedToken) {
    //throw new Error("Invalid or expired reset token.");
    throw new Error(MESSAGES.RESET_TOKEN_INVALID_OR_EXPIRED);
  }

  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

  await updatePassword(matchedToken.user_id, hashedPassword);

  // One-time use token
  await deletePasswordResetToken(matchedToken.id);

  // Logout every device
  await deleteAllRefreshTokens(matchedToken.user_id);
};
