import { Role } from "../enums/role.enum";

export type User = {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  googleId?: string;
  lastLogin?: Date;
};

export type NewUser = Omit<User, "_id" | "createdAt" | "updatedAt">;
export type PublicUser = Omit<User, "password">;
export type LoginUser = Pick<User, "email" | "password">;
export type GoogleUser = Pick<User, "name" | "email" | "avatar" | "googleId">;
