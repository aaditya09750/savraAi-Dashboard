const { StatusCodes } = require("http-status-codes");
const ApiError = require("../utils/ApiError");
const { client } = require("../lib/auth");

const getProfile = async (userId) => {
  const db = client.db();
  const userDoc = await db.collection("user").findOne({ id: userId });

  if (!userDoc || userDoc.isActive === false) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "User not found or inactive.");
  }

  return {
    id: userDoc.id,
    username: userDoc.name,
    role: userDoc.role || "ADMIN",
    lastLoginAt: userDoc.lastLoginAt || null,
  };
};

module.exports = {
  getProfile,
};
