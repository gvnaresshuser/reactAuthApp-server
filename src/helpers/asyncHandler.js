/**
 * Wraps an async controller and forwards
 * any errors to Express error middleware.
 */

const asyncHandler = (handler) => {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export default asyncHandler;
