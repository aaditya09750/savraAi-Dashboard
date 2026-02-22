const catchAsync = require("../utils/catchAsync");
const { sendSuccess } = require("../utils/apiResponse");
const analyticsService = require("../services/analytics.service");

const getDashboardOverview = catchAsync(async (req, res) => {
  const overview = await analyticsService.getDashboardOverview(req.query);
  return sendSuccess(res, {
    message: "Dashboard overview fetched successfully.",
    data: overview,
  });
});

module.exports = {
  getDashboardOverview,
};

