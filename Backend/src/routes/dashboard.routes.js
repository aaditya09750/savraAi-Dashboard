const express = require("express");
const dashboardController = require("../controllers/dashboard.controller");
const validate = require("../middlewares/validate.middleware");
const { requireAuth } = require("../middlewares/auth.middleware");
const dashboardValidation = require("../validations/dashboard.validation");

const router = express.Router();

router.get("/", requireAuth, validate(dashboardValidation.getDashboardOverview), dashboardController.getDashboardOverview);

module.exports = router;

