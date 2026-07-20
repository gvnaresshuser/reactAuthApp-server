import { validationResult } from "express-validator";
import { errorResponse } from "../utils/apiResponse.js";
import { MESSAGES } from "../constants/messages.js";
/**
 * Validation Middleware
 */

const validateMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 400, MESSAGES.VALIDATION_FAILED, errors.array());
  }
  next();
};

export default validateMiddleware;
