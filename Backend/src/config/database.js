const mongoose = require("mongoose");
const env = require("./env");
const logger = require("../utils/logger");

mongoose.set("strictQuery", true);

const connectDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const connection = await mongoose.connect(env.mongodbUri, {
    autoIndex: env.nodeEnv !== "production",
    serverSelectionTimeoutMS: 10000,
    maxPoolSize: 20,
  });

  logger.info("MongoDB connected.", {
    database: connection.connection.name,
    host: connection.connection.host,
  });

  return connection;
};

const disconnectDatabase = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    logger.info("MongoDB disconnected.");
  }
};

module.exports = {
  connectDatabase,
  disconnectDatabase,
};

