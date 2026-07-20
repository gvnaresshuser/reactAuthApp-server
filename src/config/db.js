import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

/**
 * PostgreSQL Connection Pool
 */

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  ssl:
    process.env.NODE_ENV === "production"
      ? {
          rejectUnauthorized: false,
        }
      : {
          rejectUnauthorized: false,
        },
});

/**
 * Fires whenever a new database connection is established.
 */

pool.on("connect", () => {
  console.log("✅ PostgreSQL Connected");
});

/**
 * Handles unexpected errors from idle clients.
 */

pool.on("error", (error) => {
  console.error("❌ PostgreSQL Error");
  console.error(error);
});

/**
 * Gracefully close database pool
 */

const shutdown = async () => {
  try {
    console.log("\nClosing PostgreSQL connections...");

    await pool.end();

    console.log("✅ PostgreSQL Pool Closed");

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

/**
 * Handle Ctrl + C
 */

process.on("SIGINT", shutdown);

/**
 * Handle Render shutdown
 */

process.on("SIGTERM", shutdown);

export default pool;
