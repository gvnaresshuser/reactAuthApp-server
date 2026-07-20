import { errorResponse } from "../utils/apiResponse.js";

const notFoundMiddleware = (req, res, next) => {
  return errorResponse(res, 404, `Route ${req.originalUrl} not found.`);
};

export default notFoundMiddleware;
