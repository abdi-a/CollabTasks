import express from "express";
import { register, login, protect, restrictTo, refreshToken } from "../controllers/authController.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);

// Example protected route
router.get("/me", protect, (req, res) => {
  res.status(200).json({ status: "success", user: req.user });
});

// Example role-restricted route
router.get("/admin-only", protect, restrictTo("admin"), (req, res) => {
  res.status(200).json({ status: "success", message: "Welcome admin!" });
});

export default router;
