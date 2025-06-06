import type { Request, Response } from "express";
import { usersService } from "../services/users.service";
import { authService } from "../services/auth.service";

class UsersController {
  async getUsers(req: Request, res: Response) {
    try {
      const users = await usersService.getUsers({});
      // Remove passwords from response
      const sanitizedUsers = users.map((user) => {
        const { password, ...sanitized } = user;
        return sanitized;
      });
      res.status(200).json(sanitizedUsers);
    } catch (error) {
      res.status(500).json((error as Error).message);
    }
  }

  async getUser(req: Request, res: Response) {
    const id = req.params.id;

    if (!id) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }

    try {
      const user = await usersService.getUser(id);
      if (user) {
        const { password, ...sanitized } = user;
        res.status(200).json(sanitized);
      } else {
        res.status(404).json();
      }
    } catch (error) {
      res.status(500).json((error as Error).message);
    }
  }

  async updateUser(req: Request, res: Response) {
    const id = req.params.id;
    const { _id, password, ...userData } = req.body;

    if (!id) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }

    // Hash password if provided
    if (password) {
      userData.password = await authService.hashPassword(password);
    }

    userData.updatedAt = new Date();

    try {
      const result = await usersService.updateUser(id, userData);
      res.status(200).json({ replaced: result });
    } catch (error) {
      res.status(500).json((error as Error).message);
    }
  }

  async patchUser(req: Request, res: Response) {
    const id = req.params.id;
    const { _id, password, ...userData } = req.body;

    if (!id) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }

    // Hash password if provided
    if (password) {
      userData.password = await authService.hashPassword(password);
    }

    userData.updatedAt = new Date();

    try {
      const result = await usersService.patchUser(id, userData);
      if (result) {
        res.status(200).json({ patched: result });
      } else {
        res.status(404).json({ error: "User not found or update failed" });
      }
    } catch (error) {
      res.status(500).json((error as Error).message);
    }
  }

  async removeUser(req: Request, res: Response) {
    const id = req.params.id;

    if (!id) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }

    try {
      const result = await usersService.deleteUser(id);
      res.status(200).json({ deleted: result });
    } catch (error) {
      res.status(500).json((error as Error).message);
    }
  }
}

export const usersController = new UsersController();
