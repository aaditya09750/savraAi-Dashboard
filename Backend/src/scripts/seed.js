/* eslint-disable no-console */
const bcrypt = require("bcryptjs");
const env = require("../config/env");
const logger = require("../utils/logger");
const { connectDatabase, disconnectDatabase } = require("../config/database");
const User = require("../models/User");
const ActivityLog = require("../models/ActivityLog");
const rawActivityLog = require("../data/rawActivityLog");
const { parseDatasetDate } = require("../utils/date");
const { createActivitySignature } = require("../utils/activity");

const shouldReset = process.argv.includes("--reset");

const seedAdminUser = async () => {
  const normalizedUsername = env.seedAdminUsername.trim().toLowerCase();
  const passwordHash = await bcrypt.hash(env.seedAdminPassword, env.bcryptSaltRounds);

  await User.findOneAndUpdate(
    { username: normalizedUsername },
    {
      username: normalizedUsername,
      displayName: env.seedAdminUsername.trim(),
      passwordHash,
      role: env.seedAdminRole,
      isActive: true,
    },
    {
      upsert: true,
      setDefaultsOnInsert: true,
      new: true,
    }
  );
};

const seedActivityLogs = async () => {
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

  const result = await ActivityLog.bulkWrite(operations, { ordered: false });
  await ActivityLog.collection.updateMany(
    { class: { $exists: false }, grade: { $exists: true } },
    [{ $set: { class: "$grade" } }]
  );

  return {
    inserted: result.upsertedCount || 0,
    existing: result.matchedCount || 0,
  };
};

const run = async () => {
  try {
    await connectDatabase();

    if (shouldReset) {
      await Promise.all([User.deleteMany({}), ActivityLog.deleteMany({})]);
      logger.warn("Existing data deleted before seeding.");
    }

    await seedAdminUser();
    const activityResult = await seedActivityLogs();

    logger.info("Seed operation completed.", {
      reset: shouldReset,
      insertedActivities: activityResult.inserted,
      existingActivities: activityResult.existing,
      seededAdmin: env.seedAdminUsername,
    });

    process.exit(0);
  } catch (error) {
    logger.error("Seed operation failed.", { message: error.message, stack: error.stack });
    process.exit(1);
  } finally {
    await disconnectDatabase();
  }
};

run();
