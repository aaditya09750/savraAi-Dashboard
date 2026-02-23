const { betterAuth } = require("better-auth");
const { mongodbAdapter } = require("better-auth/adapters/mongodb");
const { username } = require("better-auth/plugins");
const { MongoClient } = require("mongodb");
const env = require("../config/env");

const client = new MongoClient(env.mongodbUri);

const db = client.db();

const auth = betterAuth({
    baseURL: env.betterAuthUrl,
    secret: env.betterAuthSecret,
    database: mongodbAdapter(db),
    plugins: [username()],
    emailAndPassword: {
        enabled: true,
    },
    session: {
        expiresIn: 60 * 60 * 24,   // 1 day
        updateAge: 60 * 60 * 4,     // refresh expiration every 4 hours
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "ADMIN",
            },
            isActive: {
                type: "boolean",
                defaultValue: true,
            },
            lastLoginAt: {
                type: "date",
                required: false,
            },
        },
    },
    trustedOrigins: env.corsOrigin
        .split(",")
        .map((o) => o.trim())
        .filter(Boolean),
});

module.exports = { auth, client };
