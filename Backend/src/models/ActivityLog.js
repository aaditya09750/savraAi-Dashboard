const mongoose = require("mongoose");

const ACTIVITY_TYPES = ["Quiz", "Question Paper", "Lesson Plan"];

const ActivityLogSchema = new mongoose.Schema(
  {
    teacherId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    teacherName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    class: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    activityType: {
      type: String,
      required: true,
      enum: ACTIVITY_TYPES,
      index: true,
    },
    createdAt: {
      type: Date,
      required: true,
      index: true,
    },
    sourceCreatedAt: {
      type: String,
      required: true,
      trim: true,
    },
    signature: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: {
      createdAt: "recordCreatedAt",
      updatedAt: "recordUpdatedAt",
    },
    versionKey: false,
  }
);

ActivityLogSchema.index({ teacherId: 1, createdAt: -1 });
ActivityLogSchema.index({ class: 1, subject: 1, createdAt: -1 });
ActivityLogSchema.index({ activityType: 1, createdAt: -1 });
ActivityLogSchema.index({ teacherName: "text", subject: "text" });

module.exports = mongoose.model("ActivityLog", ActivityLogSchema);
