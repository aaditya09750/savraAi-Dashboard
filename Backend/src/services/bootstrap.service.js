const mongoose = require("mongoose");
const env = require("../config/env");
const { getAuth } = require("../lib/auth");
const ActivityLog = require("../models/ActivityLog");
const rawActivityLog = require("../data/rawActivityLog");
const { parseDatasetDate } = require("../utils/date");
const { createActivitySignature } = require("../utils/activity");
const logger = require("../utils/logger");

const ensureAdminUser = async () => {
  const db = mongoose.connection.db;
  const normalizedUsername = env.seedAdminUsername.trim().toLowerCase();

  // Check if admin user already exists in BetterAuth's user collection
  const existingUser = await db.collection("user").findOne({ username: normalizedUsername });

  if (existingUser) {
    return;
  }

  const { auth } = await getAuth();

  // Use BetterAuth's internal API to create the user properly
  await auth.api.signUpEmail({
    body: {
      email: `${normalizedUsername}@savra.admin`,
      name: env.seedAdminUsername.trim(),
      password: env.seedAdminPassword,
      username: normalizedUsername,
    },
  });

  // Update the created user with admin-specific fields
  const createdUser = await db.collection("user").findOne({ username: normalizedUsername });
  if (createdUser) {
    await db.collection("user").updateOne(
      { id: createdUser.id },
      {
        $set: {
          role: env.seedAdminRole,
          isActive: true,
          lastLoginAt: null,
        },
      }
    );
  }

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
