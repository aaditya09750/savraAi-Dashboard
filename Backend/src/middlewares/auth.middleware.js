const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const { verifyAccessToken } = require("../utils/jwt");

const requireAuth = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Bearer ")) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Authentication token is required.");
    }

    const token = authHeader.slice(7);
    const payload = verifyAccessToken(token);

    const user = await User.findById(payload.sub).lean();

    if (!user || !user.isActive) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid authentication token.");
    }

    req.auth = {
      userId: user._id.toString(),
      role: user.role,
      username: user.username,
    };

    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, "Invalid or expired authentication token."));
    }

    return next(error);
  }
};

const authorizeRoles = (...allowedRoles) => (req, _res, next) => {
  if (!req.auth || !allowedRoles.includes(req.auth.role)) {
    return next(new ApiError(StatusCodes.FORBIDDEN, "You do not have permission to access this resource."));
  }

  return next();
};

module.exports = {
  requireAuth,
  authorizeRoles,
};

