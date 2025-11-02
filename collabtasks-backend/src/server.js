import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

let server;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// Graceful shutdown
const exitHandler = () => {
  if (server) {
    console.log("🧹 Closing server...");
    server.close(() => {
      console.log("💀 Process terminated");
      process.exit(0);
    });
  } else {
    process.exit(1);
  }
};

process.on("SIGINT", exitHandler);
process.on("SIGTERM", exitHandler);
