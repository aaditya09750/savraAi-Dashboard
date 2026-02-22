const app = require("../src/app");
const { connectDatabase } = require("../src/config/database");
const { ensureBootstrapData } = require("../src/services/bootstrap.service");

let bootstrapPromise = null;

const prepareRuntime = async () => {
  if (bootstrapPromise) {
    return bootstrapPromise;
  }

  bootstrapPromise = (async () => {
    await connectDatabase();
    await ensureBootstrapData();
  })().catch((error) => {
    bootstrapPromise = null;
    throw error;
  });

  return bootstrapPromise;
};

module.exports = async (req, res) => {
  await prepareRuntime();
  return app(req, res);
};
