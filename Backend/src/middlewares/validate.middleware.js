const { StatusCodes } = require("http-status-codes");
const ApiError = require("../utils/ApiError");

const validate = (schema) => (req, _res, next) => {
  const segments = ["params", "query", "body"];
  const errors = [];

  segments.forEach((segment) => {
    if (!schema[segment]) {
      return;
    }

    const { value, error } = schema[segment].validate(req[segment], {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      errors.push(
        ...error.details.map((detail) => ({
          segment,
          field: detail.path.join("."),
          message: detail.message,
        }))
      );
      return;
    }

    req[segment] = value;
  });

  if (errors.length > 0) {
    return next(new ApiError(StatusCodes.BAD_REQUEST, "Request validation failed.", errors));
  }

  return next();
};

module.exports = validate;

