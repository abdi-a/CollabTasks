import logger from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
  // Log the error using the structured logger and also print to console for visibility
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
  });
  console.error("🔥 Error caught:", err);

  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : "Internal Server Error";

  res.status(statusCode).json({
    status: err.status || "error",
    message,
  });
};
