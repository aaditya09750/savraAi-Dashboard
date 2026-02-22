const { StatusCodes } = require("http-status-codes");

const sendSuccess = (
  res,
  { statusCode = StatusCodes.OK, message = "Request processed successfully.", data = null, meta = null } = {}
) => {
  const payload = {
    success: true,
    message,
    data,
    requestId: res.locals.requestId,
  };

  if (meta) {
    payload.meta = meta;
  }

  return res.status(statusCode).json(payload);
};

module.exports = {
  sendSuccess,
};

