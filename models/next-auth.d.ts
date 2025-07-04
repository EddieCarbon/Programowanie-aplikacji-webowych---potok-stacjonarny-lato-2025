import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      _id?: string | null;
      name?: string | null;
      email?: string | null;
      role?: string | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role?: string | null;
    _id?: string | null;
  }
}
