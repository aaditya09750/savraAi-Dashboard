const env = require("../config/env");

const levelOrder = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const currentLevel = levelOrder[env.logLevel] ?? levelOrder.info;

const write = (level, message, meta = {}) => {
  if (levelOrder[level] > currentLevel) {
    return;
  }

  const payload = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
  };

  const output = JSON.stringify(payload);

  if (level === "error") {
    console.error(output);
    return;
  }

  if (level === "warn") {
    console.warn(output);
    return;
  }

  console.log(output);
};

module.exports = {
  error: (message, meta) => write("error", message, meta),
  warn: (message, meta) => write("warn", message, meta),
  info: (message, meta) => write("info", message, meta),
  debug: (message, meta) => write("debug", message, meta),
};

