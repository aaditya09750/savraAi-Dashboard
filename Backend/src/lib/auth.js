const { MongoClient } = require("mongodb");
const env = require("../config/env");

let authInstance = null;
let nodeUtils = null;
let client = new MongoClient(env.mongodbUri);

const getAuth = async () => {
    if (authInstance) {
        return { auth: authInstance, ...nodeUtils };
    }

    // Dynamic imports for ESM BetterAuth packages in a CJS environment
    const { betterAuth } = await import("better-auth");
    const { mongodbAdapter } = await import("better-auth/adapters/mongodb");
    const { username } = await import("better-auth/plugins");
    const { toNodeHandler, fromNodeHeaders } = await import("better-auth/node");

    const db = client.db();

    authInstance = betterAuth({
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

    nodeUtils = { toNodeHandler, fromNodeHeaders };

    return { auth: authInstance, ...nodeUtils };
};

module.exports = { getAuth, client };
