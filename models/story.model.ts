import mongoose, { InferSchemaType } from "mongoose";
import { WithId } from "./with-id";

const StorySchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required"] },
  description: { type: String },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "low",
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: [true, "Project is required"],
  },
  createdAt: { type: Date, default: Date.now },
  state: { type: String, enum: ["todo", "doing", "done"], default: "todo" },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Story = mongoose.models.Story || mongoose.model("Story", StorySchema);

export type StoryType = InferSchemaType<typeof StorySchema>;
export type StoryApi = WithId<StoryType>;

export default Story;
