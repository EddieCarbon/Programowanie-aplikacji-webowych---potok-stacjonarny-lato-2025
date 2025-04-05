import type { User } from "../models/user";

const users: User[] = [
  {
    id: 1,
    username: "testuser",
    email: "test@example.com",
    firstName: "Test",
    lastName: "User",
    password: "password123",
    role: "user",
  },
  {
    id: 2,
    username: "admin",
    email: "admin@example.com",
    firstName: "Admin",
    lastName: "User",
    password: "admin123",
    role: "admin",
  },
];

export const findUserByUsername = (username: string): User | undefined => {
  return users.find((user) => user.username === username);
};

export const findUserById = (id: number): User | undefined => {
  return users.find((user) => user.id === id);
};
