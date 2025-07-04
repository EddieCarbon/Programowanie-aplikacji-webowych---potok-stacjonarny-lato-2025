import mongoose, { InferSchemaType } from "mongoose";
import { WithId } from "./with-id";

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const Project =
  mongoose.models.Project || mongoose.model("Project", ProjectSchema);

export type ProjectType = InferSchemaType<typeof ProjectSchema>;
export type ProjectApi = WithId<ProjectType>;

export default Project;
