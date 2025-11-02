import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

import { errorHandler } from "./middlewares/errorHandler.js";
import AppError from "./utils/AppError.js";

// Routes
import testRoutes from "./routes/testRoutes.js";
import testDbRoutes from "./routes/testDbRoutes.js";

const app = express();

// Core middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Routes
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "CollabTasks API is running 🚀" });
});

app.use("/api/v1/test", testRoutes);      // Test route from Lesson 1
app.use("/api/v1/db", testDbRoutes);      // Lesson 2 DB routes

// Handle unknown routes
app.all(/.*/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(errorHandler);

export default app;
