export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: string;
}

export type SafeUser = Omit<User, "password">;
