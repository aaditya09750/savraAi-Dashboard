const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const hpp = require("hpp");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const { toNodeHandler } = require("better-auth/node");
const env = require("./config/env");
const { auth } = require("./lib/auth");
const apiRoutes = require("./routes");
const requestIdMiddleware = require("./middlewares/requestId.middleware");
const { notFoundHandler, errorHandler } = require("./middlewares/error.middleware");

const app = express();

const allowedOrigins = env.corsOrigin
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const isDevLocalOrigin = (origin) =>
  env.nodeEnv !== "production" &&
  /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);

app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(requestIdMiddleware);
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(
  cors({
    origin(origin, callback) {
      if (
        !origin ||
        allowedOrigins.includes("*") ||
        allowedOrigins.includes(origin) ||
        isDevLocalOrigin(origin)
      ) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Request-Id"],
    credentials: true,
    maxAge: 86400,
  })
);
app.use(
  rateLimit({
    windowMs: env.rateLimitWindowMs,
    max: env.rateLimitMax,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: "Too many requests. Please try again later.",
    },
  })
);

if (env.nodeEnv !== "test") {
  app.use(
    morgan("combined", {
      skip: (req) => req.originalUrl === "/api/v1/health",
    })
  );
}

// BetterAuth handler — MUST be mounted before express.json()
// Handles all /api/auth/* routes (sign-in, sign-out, get-session, etc.)
app.all("/api/auth/*", toNodeHandler(auth));

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(mongoSanitize());
app.use(hpp());
app.use(compression());

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "SAVRA backend is running.",
  });
});

app.use("/api/v1", apiRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
