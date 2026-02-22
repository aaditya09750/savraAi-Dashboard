const app = require("./app");
const env = require("./config/env");
const logger = require("./utils/logger");
const { connectDatabase, disconnectDatabase } = require("./config/database");
const { ensureBootstrapData } = require("./services/bootstrap.service");

let server;
let shuttingDown = false;

const startServer = async () => {
  await connectDatabase();
  await ensureBootstrapData();
  server = app.listen(env.port, () => {
    logger.info("Server started.", {
      port: env.port,
      environment: env.nodeEnv,
    });
  });
};

const shutdown = async (signal) => {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;
  logger.warn("Graceful shutdown initiated.", { signal });

  try {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
    await disconnectDatabase();
    logger.info("Graceful shutdown completed.");
    process.exit(0);
  } catch (error) {
    logger.error("Graceful shutdown failed.", { message: error.message, stack: error.stack });
    process.exit(1);
  }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled promise rejection.", {
    reason: reason instanceof Error ? reason.message : reason,
  });
  shutdown("unhandledRejection");
});
process.on("uncaughtException", (error) => {
  logger.error("Uncaught exception.", { message: error.message, stack: error.stack });
  shutdown("uncaughtException");
});

startServer().catch((error) => {
  logger.error("Failed to start server.", { message: error.message, stack: error.stack });
  process.exit(1);
});
