const createActivitySignature = (entry) =>
  `${entry.teacherId}-${entry.createdAt}-${entry.activityType}-${entry.subject}-${entry.class ?? entry.grade}`;

module.exports = {
  createActivitySignature,
};
