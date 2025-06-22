import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: User;
    accessToken?: string;
    refreshToken?: string;
  }

  interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    lastLogin: string;
    avatar: string | null;
    googleId: string;
  }
}
