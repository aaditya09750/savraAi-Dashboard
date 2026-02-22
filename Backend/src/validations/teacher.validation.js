const Joi = require("joi");

const teacherIdParams = Joi.object({
  teacherId: Joi.string().trim().pattern(/^[A-Za-z0-9_-]+$/).required(),
});

const analyticsQuery = Joi.object({
  timeRange: Joi.string().valid("week", "month", "year").default("week"),
  class: Joi.string().trim().allow("All", "").default("All"),
  grade: Joi.string().trim().allow("All", "").default("All"),
  subject: Joi.string().trim().allow("All", "").default("All"),
});

const listTeachers = {
  query: Joi.object({
    search: Joi.string().trim().allow("").max(120).default(""),
    class: Joi.string().trim().allow("All", "").default("All"),
    grade: Joi.string().trim().allow("All", "").default("All"),
    subject: Joi.string().trim().allow("All", "").default("All"),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(50),
  }),
};

const getTeacherOverview = {
  params: teacherIdParams,
  query: analyticsQuery,
};

const exportTeacherReport = {
  params: teacherIdParams,
};

module.exports = {
  listTeachers,
  getTeacherOverview,
  exportTeacherReport,
};
