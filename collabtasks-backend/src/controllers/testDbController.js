import mongoose from "mongoose";
import User from "../models/User.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";

// Seed database with one user, project, and task
export const seedDatabase = async (req, res, next) => {
  try {
    await User.deleteMany();
    await Project.deleteMany();
    await Task.deleteMany();

    const user = await User.create({
      name: "Hamza",
      email: "hamza@example.com",
      password: "password123",
    });

    const project = await Project.create({
      name: "Backend Refactor",
      description: "Refactoring the backend architecture",
      owner: user._id,
      members: [user._id],
    });

    const task = await Task.create({
      title: "Setup Mongoose models",
      description: "Implement base schemas and relationships",
      project: project._id,
      assignee: user._id,
      dueDate: new Date(),
    });

    res.status(201).json({
      status: "success",
      data: { user, project, task },
    });
  } catch (err) {
    next(err);
  }
};

// Aggregation example: task counts by status
export const taskSummary = async (req, res, next) => {
  try {
    const summary = await Task.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({ status: "success", summary });
  } catch (err) {
    next(err);
  }
};
export const taskSummaryUsingModel = async (req, res, next) => {
  try {
    const summary = await mongoose.model("Task").aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({ status: "success", summary });
  } catch (err) {
    next(err);
  }
};
