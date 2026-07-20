import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

import authRoutes from "./routes/authRoutes.js";

import notFoundMiddleware from "./middleware/notFoundMiddleware.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

const app = express();

/**
 * Global Middlewares
 */

app.use(helmet());

app.use(compression());

app.use(morgan("dev"));

app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,

    credentials: true,
  }),
);

/**
 * Health Check
 */

app.get("/", (req, res) => {
  res.json({
    success: true,

    message: "API Running Successfully",
  });
});

/**
 * Routes
 */

app.use(
  "/api/auth",

  authRoutes,
);

/**
 * 404 Middleware
 */

app.use(notFoundMiddleware);

/**
 * Global Error Middleware
 */

app.use(errorMiddleware);

export default app;
