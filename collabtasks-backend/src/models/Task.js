import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task must have a title"],
    },
    description: String,
    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Task must belong to a project"],
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    dueDate: Date,
  },
  { timestamps: true }
);

// Index for performance
taskSchema.index({ project: 1, status: 1 });
taskSchema.index({ assignee: 1 });

const Task = mongoose.model("Task", taskSchema);
export default Task;
