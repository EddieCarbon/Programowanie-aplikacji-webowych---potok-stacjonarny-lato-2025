import type { Task } from "../models/task/task.model";
import type { WithoutId } from "mongodb";
import { dbService } from "./db.service";

class TasksService {
  private collectionName = "tasks";
  getTasks(query: Record<string, any>) {
    return dbService.find<Task>(query, this.collectionName);
  }
  getTask(id: string) {
    return dbService.findOne<Task>(id, this.collectionName);
  }
  async createTask(task: WithoutId<Task>) {
    return dbService.create(task, this.collectionName);
  }
  updateTask(id: string, task: WithoutId<Task>) {
    return dbService.replace(id, task, this.collectionName);
  }
  patchTask(id: string, task: Partial<WithoutId<Task>>) {
    return dbService.patch(id, task, this.collectionName);
  }
  deleteTask(id: string) {
    return dbService.delete(id, this.collectionName);
  }
}

export const tasksService = new TasksService();
