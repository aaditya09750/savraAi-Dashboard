const catchAsync = require("../utils/catchAsync");
const { sendSuccess } = require("../utils/apiResponse");
const authService = require("../services/auth.service");

const login = catchAsync(async (req, res) => {
  const payload = await authService.login(req.body);
  return sendSuccess(res, {
    message: "Login successful.",
    data: payload,
  });
});

const me = catchAsync(async (req, res) => {
  const profile = await authService.getProfile(req.auth.userId);
  return sendSuccess(res, {
    message: "Authenticated profile fetched successfully.",
    data: profile,
  });
});

module.exports = {
  login,
  me,
};

