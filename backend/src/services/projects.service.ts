import type { Project } from "../models/project/project.model";
import type { WithoutId } from "mongodb";
import { dbService } from "./db.service";

class ProjectsService {
  private collectionName = "projects";
  getProjects(query: Record<string, any>) {
    return dbService.find<Project>(query, this.collectionName);
  }
  getProject(id: string) {
    return dbService.findOne<Project>(id, this.collectionName);
  }
  async createProject(project: WithoutId<Project>) {
    return dbService.create(project, this.collectionName);
  }
  updateProject(id: string, project: WithoutId<Project>) {
    return dbService.replace(id, project, this.collectionName);
  }
  patchProject(id: string, project: Partial<WithoutId<Project>>) {
    return dbService.patch(id, project, this.collectionName);
  }
  deleteProject(id: string) {
    return dbService.delete(id, this.collectionName);
  }
}

export const projectsService = new ProjectsService();
