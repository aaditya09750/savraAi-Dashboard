const { StatusCodes } = require("http-status-codes");
const mongoose = require("mongoose");
const ApiError = require("../utils/ApiError");
const logger = require("../utils/logger");
const env = require("../config/env");

const normalizeError = (error) => {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof mongoose.Error.ValidationError) {
    const details = Object.values(error.errors).map((entry) => ({
      field: entry.path,
      message: entry.message,
    }));

    return new ApiError(StatusCodes.BAD_REQUEST, "Database validation failed.", details);
  }

  if (error instanceof mongoose.Error.CastError) {
    return new ApiError(StatusCodes.BAD_REQUEST, `Invalid value for "${error.path}".`);
  }

  if (error && error.code === 11000) {
    return new ApiError(StatusCodes.CONFLICT, "A resource with the same unique value already exists.");
  }

  if (error && (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError")) {
    return new ApiError(StatusCodes.UNAUTHORIZED, "Invalid or expired authentication token.");
  }

  return new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal server error.", null, false);
};

const notFoundHandler = (req, _res, next) => {
  next(new ApiError(StatusCodes.NOT_FOUND, `Route not found: ${req.method} ${req.originalUrl}`));
};

const errorHandler = (error, req, res, _next) => {
  const normalizedError = normalizeError(error);

  logger.error("Request failed.", {
    requestId: res.locals.requestId,
    method: req.method,
    path: req.originalUrl,
    statusCode: normalizedError.statusCode,
    message: normalizedError.message,
    stack: error.stack,
  });

  const message =
    env.nodeEnv === "production" && normalizedError.statusCode === StatusCodes.INTERNAL_SERVER_ERROR
      ? "Internal server error."
      : normalizedError.message;

  const response = {
    success: false,
    message,
    requestId: res.locals.requestId,
  };

  if (normalizedError.details) {
    response.errors = normalizedError.details;
  }

  return res.status(normalizedError.statusCode).json(response);
};

module.exports = {
  notFoundHandler,
  errorHandler,
};

