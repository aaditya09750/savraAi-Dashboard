const catchAsync = require("../utils/catchAsync");
const { sendSuccess } = require("../utils/apiResponse");
const analyticsService = require("../services/analytics.service");

const getFilters = catchAsync(async (_req, res) => {
  const filters = await analyticsService.getAvailableFilters();
  return sendSuccess(res, {
    message: "Filter options fetched successfully.",
    data: filters,
  });
});

module.exports = {
  getFilters,
};

