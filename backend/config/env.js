// src/config/env.js
const fs = require("fs");
const { z } = require("zod");

const Env = z.object({
  DB_HOST: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  DB_SSL_CA: z.string().optional(),
  DB_SSL_CERT: z.string().optional(),
  DB_SSL_KEY: z.string().optional(),
  SMTP_EMAIL: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  NEXT_PUBLIC_BUSINESS_NAME: z.string().optional(),
  PORT: z.string().optional().default("5000"),
});

const parsed = Env.safeParse(process.env);
if (!parsed.success) {
  console.error("❌ Missing/invalid environment variables:");
  parsed.error.issues.forEach((i) => console.error(`  - ${i.path.join(".")}: ${i.message}`));
  process.exit(1);
}

const env = parsed.data;

// optional DB SSL
let ssl = undefined;
if (env.DB_SSL_CA && env.DB_SSL_CERT && env.DB_SSL_KEY) {
  try {
    ssl = {
      ca: fs.readFileSync(env.DB_SSL_CA),
      cert: fs.readFileSync(env.DB_SSL_CERT),
      key: fs.readFileSync(env.DB_SSL_KEY),
      rejectUnauthorized: false,
    };
    console.log("🔐 DB SSL enabled.");
  } catch (e) {
    console.error("❌ Failed to read DB SSL files:", e.message);
    console.error("⚠️ Continuing without SSL.");
    ssl = undefined;
  }
}

module.exports = { env, ssl };
