const express = require("express");
const authController = require("../controllers/auth.controller");
const validate = require("../middlewares/validate.middleware");
const { requireAuth } = require("../middlewares/auth.middleware");
const authValidation = require("../validations/auth.validation");

const router = express.Router();

router.post("/login", validate(authValidation.login), authController.login);
router.get("/me", requireAuth, authController.me);

module.exports = router;

