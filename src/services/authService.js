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
} from "../repositories/refreshTokenRepository.js";
import SALT_ROUNDS from "../config/security.js";
import jwt from "jsonwebtoken";

import verifyRefreshToken from "../utils/verifyRefreshToken.js";

export const registerService = async (fullName, email, password) => {
  // Check existing user
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error(MESSAGES.EMAIL_ALREADY_EXISTS);
  }
  // Hash password
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  // Create user
  const user = await createUser(fullName, email, hashedPassword);
  return user;
};

export const loginService = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error(MESSAGES.INVALID_CREDENTIALS);
  }
  if (!user.is_active) {
    throw new Error(MESSAGES.ACCOUNT_DISABLED);
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error(MESSAGES.INVALID_CREDENTIALS);
  }
  const accessToken = generateToken(user);
  const refreshToken = generateRefreshToken(user);
  const refreshTokenHash = await bcrypt.hash(refreshToken, SALT_ROUNDS);
  const expiresAt = new Date();
  const days = parseInt(process.env.REFRESH_TOKEN_EXPIRY, 10) || 7;
  expiresAt.setDate(expiresAt.getDate() + days);
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
  if (!refreshToken) {
    throw new Error(MESSAGES.UNAUTHORIZED);
  }

  // Verify JWT signature
  const payload = verifyRefreshToken(refreshToken);

  // Find user
  const user = await findUserById(payload.id);

  if (!user) {
    throw new Error(MESSAGES.USER_NOT_FOUND);
  }

  // Get all stored refresh tokens
  const tokens = await findRefreshTokensByUserId(user.id);

  let matchedToken = null;

  for (const token of tokens) {
    const isMatch = await bcrypt.compare(refreshToken, token.token);

    if (isMatch) {
      matchedToken = token;
      break;
    }
  }

  if (!matchedToken) {
    throw new Error(MESSAGES.UNAUTHORIZED);
  }

  // Delete old refresh token (Rotation)
  await deleteRefreshToken(matchedToken.id);

  // Generate new tokens
  const accessToken = generateToken(user);

  const newRefreshToken = generateRefreshToken(user);

  const refreshHash = await bcrypt.hash(newRefreshToken, SALT_ROUNDS);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

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
    payload = verifyRefreshToken(refreshToken);
  } catch {
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