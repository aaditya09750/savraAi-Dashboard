const bcrypt = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const { signAccessToken } = require("../utils/jwt");

const normalizeUsername = (value) => String(value || "").trim().toLowerCase();

const login = async ({ username, password }) => {
  const normalizedUsername = normalizeUsername(username);

  const user = await User.findOne({
    username: normalizedUsername,
    isActive: true,
  }).select("+passwordHash");

  if (!user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid username or password.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid username or password.");
  }

  user.lastLoginAt = new Date();
  await user.save();

  const accessToken = signAccessToken({
    sub: user._id.toString(),
    role: user.role,
    username: user.username,
  });

  return {
    token: accessToken,
    user: {
      id: user._id.toString(),
      username: user.displayName,
      role: user.role,
    },
  };
};

const getProfile = async (userId) => {
  const user = await User.findById(userId).lean();

  if (!user || !user.isActive) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "User not found or inactive.");
  }

  return {
    id: user._id.toString(),
    username: user.displayName,
    role: user.role,
    lastLoginAt: user.lastLoginAt,
  };
};

module.exports = {
  login,
  getProfile,
};

