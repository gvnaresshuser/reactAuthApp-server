/**
 * Application Messages
 */

export const MESSAGES = Object.freeze({
  // =====================================================
  // GENERAL
  // =====================================================

  SUCCESS: "Operation completed successfully.",
  INTERNAL_SERVER_ERROR: "Internal server error.",
  VALIDATION_FAILED: "Validation failed.",
  RESOURCE_NOT_FOUND: "Resource not found.",
  UNAUTHORIZED: "Unauthorized access.",
  FORBIDDEN: "Access denied.",

  // =====================================================
  // AUTHENTICATION
  // =====================================================

  REGISTER_SUCCESS: "User registered successfully.",
  LOGIN_SUCCESS: "Login successful.",
  LOGOUT_SUCCESS: "Logout successful.",
  PROFILE_FETCHED: "Profile fetched successfully.",
  INVALID_CREDENTIALS: "Invalid email or password.",
  EMAIL_ALREADY_EXISTS: "Email already exists.",
  USER_NOT_FOUND: "User not found.",
  ACCOUNT_DISABLED: "Your account has been disabled.",
  INVALID_TOKEN: "Invalid token.",
  TOKEN_EXPIRED: "Token has expired.",
  REFRESH_TOKEN_REQUIRED: "Refresh token is required.",

  // =====================================================
  // PRODUCTS
  // =====================================================

  PRODUCT_CREATED: "Product created successfully.",
  PRODUCT_UPDATED: "Product updated successfully.",
  PRODUCT_DELETED: "Product deleted successfully.",
  PRODUCT_FETCHED: "Product retrieved successfully.",
  PRODUCTS_FETCHED: "Products retrieved successfully.",

  TOKEN_REFRESHED: "Token refreshed successfully.",

  LOGOUT_SUCCESS: "Logout successful.",
});
