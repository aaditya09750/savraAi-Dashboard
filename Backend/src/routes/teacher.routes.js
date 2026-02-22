const express = require("express");
const teacherController = require("../controllers/teacher.controller");
const validate = require("../middlewares/validate.middleware");
const { requireAuth } = require("../middlewares/auth.middleware");
const teacherValidation = require("../validations/teacher.validation");

const router = express.Router();

router.get("/", requireAuth, validate(teacherValidation.listTeachers), teacherController.listTeachers);
router.get(
  "/:teacherId/report.csv",
  requireAuth,
  validate(teacherValidation.exportTeacherReport),
  teacherController.exportTeacherReport
);
router.get(
  "/:teacherId",
  requireAuth,
  validate(teacherValidation.getTeacherOverview),
  teacherController.getTeacherOverview
);

module.exports = router;

