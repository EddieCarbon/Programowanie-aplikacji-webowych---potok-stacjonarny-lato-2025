import type { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { usersService } from "../services/users.service";
import { Role } from "../models/enums/role.enum";

class AuthController {
  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    try {
      const result = await authService.authenticateUser(email, password);
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async googleLogin(req: Request, res: Response) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(400).json({ error: "Google token is required" });
      return;
    }
    const token = authHeader.replace(/^Bearer\s+/i, "");

    try {
      const result = await authService.authenticateWithGoogle(token);
      res.status(200).json(result);
    } catch (error) {
      console.error("Google login error:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async refreshToken(req: Request, res: Response) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ error: "Refresh token is required" });
      return;
    }

    try {
      const result = await authService.refreshToken(refreshToken);
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(401).json({ error: "Invalid refresh token" });
      }
    } catch (error) {
      console.error("Refresh token error:", error);
      res.status(500).json({ error: "Failed to refresh token" });
    }
  }

  async getCurrentUser(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const user = await authService.getCurrentUser(userId);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.error("Get current user error:", error);
      res.status(500).json({ error: "Failed to get user data" });
    }
  }

  async register(req: Request, res: Response) {
    const { name, email, password, role = Role.DEVELOPER } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: "Name, email and password are required" });
    }

    try {
      const existingUser = await usersService.getUserByEmail(email);
      if (existingUser) {
        res.status(409).json({ error: "User with this email already exists" });
      }

      const hashedPassword = await authService.hashPassword(password);
      const newUser = {
        name,
        email,
        password: hashedPassword,
        role: role as Role,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const userId = await usersService.createUser(newUser);
      if (userId) {
        res.status(201).json({ id: userId });
      } else {
        res.status(500).json({ error: "Failed to create user" });
      }
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  }
}

export const authController = new AuthController();
