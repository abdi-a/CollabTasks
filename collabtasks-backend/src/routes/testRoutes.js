import express from "express";
import AppError from "../utils/AppError.js";

const router = express.Router();

// ✅ normal route
router.get("/", (req, res) => {
  res.status(200).json({
    developer: "Hamza", // ← put your name here
    time: new Date().toISOString(),
    message: "Test route working fine ✅",
  });
});

// 💥 route to simulate an error
router.get("/error", (req, res, next) => {
  next(new AppError("This is a simulated test error 🔥", 400));
});

export default router;
