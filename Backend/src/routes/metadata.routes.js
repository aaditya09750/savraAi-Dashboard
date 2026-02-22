const express = require("express");
const metadataController = require("../controllers/metadata.controller");
const { requireAuth } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/filters", requireAuth, metadataController.getFilters);

module.exports = router;

