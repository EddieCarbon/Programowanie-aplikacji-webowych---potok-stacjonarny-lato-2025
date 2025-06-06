import { Priority } from "../enums/priority.enum";
import { Status } from "../enums/status.enum";

export type Task = {
  _id: string;
  name: string;
  description: string;
  priority: Priority;
  storyId: string;
  estimatedTime: number; // In hours
  status: Status;
  creationDate: Date;
  startDate?: Date; // When status changes to DOING
  completionDate?: Date; // When status changes to DONE
  assignedUserId?: string; // User ID
};

export type NewTask = Omit<
  Task,
  "_id" | "creationDate" | "startDate" | "completionDate"
>;
