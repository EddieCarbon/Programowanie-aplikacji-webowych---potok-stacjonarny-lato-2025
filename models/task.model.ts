import mongoose, { InferSchemaType } from "mongoose";
import { WithId } from "./with-id";

const TaskSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required"] },
  description: { type: String },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "low",
  },
  story: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Story",
    required: [true, "Story is required"],
  },
  estimatedHours: { type: Number },
  state: { type: String, enum: ["todo", "doing", "done"], default: "todo" },
  createdAt: { type: Date, default: Date.now },
  startedAt: { type: Date },
  finishedAt: { type: Date },
  workedHours: { type: Number, default: 0 },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Task = mongoose.models.Task || mongoose.model("Task", TaskSchema);
export type TaskType = InferSchemaType<typeof TaskSchema>;
export type TaskApi = WithId<TaskType>;

export default Task;
