import { body } from "express-validator";

/**
 * Create Product Validation
 */
export const createProductValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required.")
    .isLength({ min: 2, max: 150 })
    .withMessage("Product name must be between 2 and 150 characters."),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters."),

  body("price")
    .notEmpty()
    .withMessage("Price is required.")
    .isFloat({ min: 0 })
    .withMessage("Price must be greater than or equal to 0."),

  body("stock")
    .notEmpty()
    .withMessage("Stock is required.")
    .isInt({ min: 0 })
    .withMessage("Stock must be a positive integer."),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required.")
    .isLength({ min: 2, max: 100 })
    .withMessage("Category must be between 2 and 100 characters."),

  body("image_url")
    .optional()
    .trim()
    .isURL()
    .withMessage("Image URL must be valid."),
];

/**
 * Update Product Validation
 */
export const updateProductValidation = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage("Product name must be between 2 and 150 characters."),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters."),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be greater than or equal to 0."),

  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a positive integer."),

  body("category")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Category must be between 2 and 100 characters."),

  body("image_url")
    .optional()
    .trim()
    .isURL()
    .withMessage("Image URL must be valid."),
];
