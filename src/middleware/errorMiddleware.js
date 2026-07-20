import { errorResponse } from "../utils/apiResponse.js";
import { MESSAGES } from "../constants/messages.js";

/**
 * Global Error Handler
 */

const errorMiddleware = (err, req, res, next) => {
  console.error("===================================");
  console.error(err);
  console.error("===================================");
  const statusCode = err.statusCode || 500;
  return errorResponse(
    res,
    statusCode,
    err.message || MESSAGES.INTERNAL_SERVER_ERROR,
  );
};

export default errorMiddleware;
