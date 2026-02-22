const { randomUUID } = require("crypto");

const requestIdMiddleware = (req, res, next) => {
  const incomingRequestId = req.headers["x-request-id"];
  const requestId = incomingRequestId || randomUUID();

  req.requestId = requestId;
  res.locals.requestId = requestId;
  res.setHeader("x-request-id", requestId);

  next();
};

module.exports = requestIdMiddleware;

