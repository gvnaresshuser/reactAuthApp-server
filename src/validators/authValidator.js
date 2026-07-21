import { body } from "express-validator";

export const registerValidator = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full Name is required.")
    .isLength({ min: 3, max: 100 })
    .withMessage("Full Name must be between 3 and 100 characters."),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      "Password must contain at least 8 characters including uppercase, lowercase, number and special character.",
    ),
];

export const loginValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("Password is required."),
];

export const updateProfileValidator = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full Name is required.")
    .isLength({ min: 3, max: 100 })
    .withMessage("Full Name must be between 3 and 100 characters."),
];

export const changePasswordValidator = [
  body("currentPassword")
    .trim()
    .notEmpty()
    .withMessage("Current password is required."),
  body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("New password is required.")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters."),
];

export const forgotPasswordValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .normalizeEmail(),
];
export const resetPasswordValidator = [
  body("token").trim().notEmpty().withMessage("Reset token is required."),

  body("newPassword")
    .notEmpty()
    .withMessage("Password is required.")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      "Password must contain at least 8 characters including uppercase, lowercase, number and special character.",
    ),
];