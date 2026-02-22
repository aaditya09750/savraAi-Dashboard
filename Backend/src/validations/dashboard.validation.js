const Joi = require("joi");

const getDashboardOverview = {
  query: Joi.object({
    timeRange: Joi.string().valid("week", "month", "year").default("week"),
    class: Joi.string().trim().allow("All", "").default("All"),
    grade: Joi.string().trim().allow("All", "").default("All"),
    subject: Joi.string().trim().allow("All", "").default("All"),
    search: Joi.string().trim().allow("").max(120).default(""),
  }),
};

module.exports = {
  getDashboardOverview,
};
