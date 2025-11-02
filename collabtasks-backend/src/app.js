import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler.js";
import AppError from "./utils/AppError.js";
import testRoutes from "./routes/testRoutes.js"; // ← new import
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Routes
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "CollabTasks API is running 🚀" });
});

app.get("/error", (req, res, next) => {
  next(new AppError("Simulated failure for testing 🔥", 400));
});
app.use("/api/v1/test", testRoutes); // ← mount new route

// Handle unknown routes
// Catch all unmatched routes (Express 5 compatible)
app.all(/.*/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});


// Handle unknown routes (fixed syntax)
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(errorHandler);

export default app;

