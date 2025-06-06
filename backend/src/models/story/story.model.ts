import { Priority } from "../enums/priority.enum";
import { Status } from "../enums/status.enum";

export type Story = {
  _id: string;
  name: string;
  description: string;
  priority: Priority;
  projectId: string;
  creationDate: Date;
  status: Status;
  ownerId: string;
};

export type NewStory = Omit<Story, "_id" | "creationDate" | "status">;
