import express from "express";
import type { Request, Response } from "express";
import {
  authenticateUser,
  generateTokens,
  refreshAccessToken,
  getSafeUser,
} from "../services/auth";
import { authMiddleware } from "../middleware/auth";
import { findUserById } from "../db/userDb";
import type { AuthRequest } from "../middleware/auth";

// Create a router instance
const router = express.Router();

// Endpoint do logowania
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ message: "Username and password are required" });
  }

  const user = authenticateUser(username, password);
  if (!user) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const { token, refreshToken } = generateTokens(user);

  res.json({
    message: "Login successful",
    token,
    refreshToken,
  });
});

// Endpoint do odświeżania tokenu
router.post("/refresh", (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400).json({ message: "Refresh token is required" });
    return;
  }

  try {
    const result = refreshAccessToken(refreshToken);
    res.json({
      message: "Token refreshed successfully",
      token: result.token,
      refreshToken,
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid refresh token" });
    return;
  }
});

// Endpoint do pobierania danych użytkownika
router.get("/me", authMiddleware, (req: AuthRequest, res: Response) => {
  const { userId } = req.user!;

  const user = findUserById(userId);

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  const safeUser = getSafeUser(user);

  res.json({
    user: safeUser,
  });
});

export default router;
