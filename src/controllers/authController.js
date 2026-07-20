import dotenv from "dotenv";
dotenv.config();
import asyncHandler from "../helpers/asyncHandler.js";
import {
  registerService,
  loginService,
  profileService,
  updateProfileService,
  changePasswordService,
  refreshTokenService,
  logoutService,
  logoutAllDevicesService,
} from "../services/authService.js";
import { successResponse } from "../utils/apiResponse.js";
import { MESSAGES } from "../constants/messages.js";
import cookieOptions from "../utils/cookieOptions.js";

export const register = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;
  const user = await registerService(fullName, email, password);
  return successResponse(res, 201, MESSAGES.REGISTER_SUCCESS, user);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await loginService(
    email,
    password,
  );
  res.cookie(process.env.COOKIE_NAME, refreshToken, cookieOptions);
  return successResponse(res, 200, MESSAGES.LOGIN_SUCCESS, {
    user,
    accessToken,
  });
});

export const profile = asyncHandler(async (req, res) => {
  const user = await profileService(req.user.id);

  return successResponse(res, 200, MESSAGES.SUCCESS, user);
});

/**
 * Update Profile
 */

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await updateProfileService(req.user.id, req.body);
  return successResponse(res, 200, "Profile updated successfully.", user);
});

/**
 * Change Password
 */

export const changePassword = asyncHandler(async (req, res) => {
  await changePasswordService(req.user.id, req.body);
  return successResponse(res, 200, "Password changed successfully.");
});

/**
 * Refresh Access Token
 */
export const refreshToken = asyncHandler(async (req, res) => {
  const refreshTokenCookie = req.cookies[process.env.COOKIE_NAME];

  const result = await refreshTokenService(refreshTokenCookie);

  res.cookie(process.env.COOKIE_NAME, result.refreshToken, cookieOptions);

  return successResponse(res, 200, MESSAGES.TOKEN_REFRESHED, {
    accessToken: result.accessToken,
  });
});
/**
 * Logout
 */
export const logout = asyncHandler(async (req, res) => {
  const refreshTokenCookie = req.cookies[process.env.COOKIE_NAME];

  await logoutService(refreshTokenCookie);

  res.clearCookie(process.env.COOKIE_NAME, cookieOptions);

  return successResponse(res, 200, MESSAGES.LOGOUT_SUCCESS);
});
export const logoutAllDevices = asyncHandler(async (req, res) => {
  await logoutAllDevicesService(req.user.id);

  res.clearCookie(process.env.COOKIE_NAME, cookieOptions);

  return successResponse(res, 200, "Logged out from all devices.");
});