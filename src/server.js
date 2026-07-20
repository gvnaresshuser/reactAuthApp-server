import dotenv from "dotenv";

dotenv.config();

import app from "./app.js";

import pool from "./config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await pool.query("SELECT NOW()");

    console.log("✅ PostgreSQL Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
};

startServer();
