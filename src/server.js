import dotenv from "dotenv";

dotenv.config();

import app from "./app.js";

import pool from "./config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await pool.query("SELECT NOW()");

    console.log("Database Connected Successfully.");

    app.listen(PORT, () => {
      console.log(`
====================================
🚀 Server Started Successfully
====================================
URL  : http://localhost:${PORT}
Mode : ${process.env.NODE_ENV}
====================================
`);
    });
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
};

startServer();
