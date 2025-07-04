import { connect } from "@/lib/db.config";
import Project from "@/models/project.model";

export async function getProjects() {
  await connect();
  return Project.find({}).sort({ createdAt: -1 });
}

export async function getProjectById(id: string) {
  await connect();
  return Project.findById(id);
}

export async function createProject(data: {
  name: string;
  description?: string;
}) {
  await connect();
  const project = new Project(data);
  return project.save();
}

export async function updateProject(
  id: string,
  data: { name?: string; description?: string }
) {
  await connect();
  return Project.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteProject(id: string) {
  await connect();
  return Project.findByIdAndDelete(id);
}
