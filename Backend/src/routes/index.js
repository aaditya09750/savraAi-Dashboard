const express = require("express");
const authRoutes = require("./auth.routes");
const dashboardRoutes = require("./dashboard.routes");
const teacherRoutes = require("./teacher.routes");
const metadataRoutes = require("./metadata.routes");
const { sendSuccess } = require("../utils/apiResponse");

const router = express.Router();

router.get("/health", (_req, res) =>
  sendSuccess(res, {
    message: "Backend service is healthy.",
    data: {
      status: "ok",
      timestamp: new Date().toISOString(),
    },
  })
);

router.use("/auth", authRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/teachers", teacherRoutes);
router.use("/meta", metadataRoutes);

module.exports = router;

