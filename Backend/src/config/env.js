const dotenv = require("dotenv");
const Joi = require("joi");

dotenv.config();

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid("development", "production", "test").default("development"),
  PORT: Joi.number().integer().min(1).max(65535).default(5000),
  MONGODB_URI: Joi.string().uri({ scheme: ["mongodb", "mongodb+srv"] }).required(),
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default("1d"),
  CORS_ORIGIN: Joi.string().default("http://localhost:5173"),
  RATE_LIMIT_WINDOW_MS: Joi.number().integer().min(1000).default(15 * 60 * 1000),
  RATE_LIMIT_MAX: Joi.number().integer().min(1).default(200),
  BCRYPT_SALT_ROUNDS: Joi.number().integer().min(8).max(15).default(12),
  LOG_LEVEL: Joi.string().valid("error", "warn", "info", "debug").default("info"),
  SEED_ADMIN_USERNAME: Joi.string().trim().min(3).max(50).default("Admin"),
  SEED_ADMIN_PASSWORD: Joi.string().min(8).max(128).default("Savra@321"),
  SEED_ADMIN_ROLE: Joi.string().valid("ADMIN", "SUPER_ADMIN").default("ADMIN"),
}).unknown(true);

const { value: validatedEnv, error } = envSchema.validate(process.env, {
  abortEarly: false,
  convert: true,
});

if (error) {
  throw new Error(`Environment validation error: ${error.message}`);
}

module.exports = {
  nodeEnv: validatedEnv.NODE_ENV,
  port: validatedEnv.PORT,
  mongodbUri: validatedEnv.MONGODB_URI,
  jwtSecret: validatedEnv.JWT_SECRET,
  jwtExpiresIn: validatedEnv.JWT_EXPIRES_IN,
  corsOrigin: validatedEnv.CORS_ORIGIN,
  rateLimitWindowMs: validatedEnv.RATE_LIMIT_WINDOW_MS,
  rateLimitMax: validatedEnv.RATE_LIMIT_MAX,
  bcryptSaltRounds: validatedEnv.BCRYPT_SALT_ROUNDS,
  logLevel: validatedEnv.LOG_LEVEL,
  seedAdminUsername: validatedEnv.SEED_ADMIN_USERNAME,
  seedAdminPassword: validatedEnv.SEED_ADMIN_PASSWORD,
  seedAdminRole: validatedEnv.SEED_ADMIN_ROLE,
};

