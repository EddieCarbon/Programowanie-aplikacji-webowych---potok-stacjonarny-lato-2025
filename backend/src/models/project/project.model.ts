export type Project = {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  userId: string;
};

export type NewProject = Omit<Project, "_id">;
