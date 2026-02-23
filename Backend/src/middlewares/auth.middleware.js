const { StatusCodes } = require("http-status-codes");
const ApiError = require("../utils/ApiError");
const { fromNodeHeaders } = require("better-auth/node");
const { auth } = require("../lib/auth");

const requireAuth = async (req, _res, next) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session || !session.user) {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, "Authentication token is required."));
    }

    if (session.user.isActive === false) {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, "Invalid authentication token."));
    }

    req.auth = {
      userId: session.user.id,
      role: session.user.role || "ADMIN",
      username: session.user.name,
    };

    return next();
  } catch (error) {
    return next(new ApiError(StatusCodes.UNAUTHORIZED, "Invalid or expired authentication token."));
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
