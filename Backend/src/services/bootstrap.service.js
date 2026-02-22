const bcrypt = require("bcryptjs");
const env = require("../config/env");
const User = require("../models/User");
const ActivityLog = require("../models/ActivityLog");
const rawActivityLog = require("../data/rawActivityLog");
const { parseDatasetDate } = require("../utils/date");
const { createActivitySignature } = require("../utils/activity");
const logger = require("../utils/logger");

const ensureAdminUser = async () => {
  const normalizedUsername = env.seedAdminUsername.trim().toLowerCase();
  const existingUser = await User.findOne({ username: normalizedUsername }).lean();

  if (existingUser) {
    return;
  }

  const passwordHash = await bcrypt.hash(env.seedAdminPassword, env.bcryptSaltRounds);

  await User.create({
    username: normalizedUsername,
    displayName: env.seedAdminUsername.trim(),
    passwordHash,
    role: env.seedAdminRole,
    isActive: true,
  });

  logger.info("Bootstrap admin user created.", {
    username: env.seedAdminUsername.trim(),
  });
};

const ensureActivityData = async () => {
  const totalActivities = await ActivityLog.estimatedDocumentCount();

  if (totalActivities > 0) {
    await ActivityLog.collection.updateMany(
      { class: { $exists: false }, grade: { $exists: true } },
      [{ $set: { class: "$grade" } }]
    );
    return;
  }

  const operations = rawActivityLog.map((entry) => {
    const signature = createActivitySignature(entry);
    return {
      updateOne: {
        filter: { signature },
        update: {
          $set: {
            class: entry.class ?? entry.grade,
          },
          $setOnInsert: {
            teacherId: entry.teacherId,
            teacherName: entry.teacherName,
            subject: entry.subject,
            activityType: entry.activityType,
            createdAt: parseDatasetDate(entry.createdAt),
            sourceCreatedAt: entry.createdAt,
            signature,
          },
        },
        upsert: true,
      },
    };
  });

  await ActivityLog.bulkWrite(operations, { ordered: false });

  logger.info("Bootstrap activity data inserted.", {
    records: rawActivityLog.length,
  });
};

const ensureBootstrapData = async () => {
  await ensureAdminUser();
  await ensureActivityData();
};

module.exports = {
  ensureBootstrapData,
};

