const { StatusCodes } = require("http-status-codes");
const catchAsync = require("../utils/catchAsync");
const { sendSuccess } = require("../utils/apiResponse");
const analyticsService = require("../services/analytics.service");

const listTeachers = catchAsync(async (req, res) => {
  const teachers = await analyticsService.getTeacherDirectory(req.query);
  return sendSuccess(res, {
    message: "Teacher list fetched successfully.",
    data: teachers.items,
    meta: teachers.pagination,
  });
});

const getTeacherOverview = catchAsync(async (req, res) => {
  const payload = await analyticsService.getTeacherOverview({
    teacherId: req.params.teacherId,
    ...req.query,
  });

  return sendSuccess(res, {
    message: "Teacher overview fetched successfully.",
    data: payload,
  });
});

const exportTeacherReport = catchAsync(async (req, res) => {
  const report = await analyticsService.getTeacherCsvReport(req.params.teacherId);
  const fileName = `${report.teacherName.replace(/\s+/g, "_")}_Activity_Report.csv`;

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
  res.status(StatusCodes.OK).send(report.csv);
});

module.exports = {
  listTeachers,
  getTeacherOverview,
  exportTeacherReport,
};

