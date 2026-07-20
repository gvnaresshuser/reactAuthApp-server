import { errorResponse } from "../utils/apiResponse.js";

import { MESSAGES } from "../constants/messages.js";

/**
 * Role Authorization Middleware
 */

const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return errorResponse(res, 403, MESSAGES.FORBIDDEN);
    }
    next();
  };
};

export default roleMiddleware;
