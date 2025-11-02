import express from "express";
import { seedDatabase, taskSummary } from "../controllers/testDbController.js";

const router = express.Router();

router.get("/summary", taskSummary);
// POST /api/v1/db/seed → create dummy data
router.post("/seed", seedDatabase);

// GET /api/v1/db/summary → aggregation example
router.get("/summary", taskSummary);

export default router;
