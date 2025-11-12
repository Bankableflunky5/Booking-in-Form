// src/db/pool.js
const mysql = require("mysql2");
const { env, ssl } = require("../config/env");

// Create a single pool; always use the promise API.
const pool = mysql.createPool({
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ...(ssl ? { ssl } : {}),
});

const db = pool.promise();
module.exports = { db };
