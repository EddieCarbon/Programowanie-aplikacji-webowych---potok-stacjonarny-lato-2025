import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { Role } from "../models/enums/role.enum";
import config from "../../config.json";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.header("Authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7)
    : authHeader;

  if (!token) {
    res.status(401).send({ error: "Access denied. No token provided." });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.jwt_secret) as any;
    (req as any).userId = decoded.userId;
    (req as any).userRole = decoded.role;
    (req as any).userEmail = decoded.email;
    next();
  } catch (error) {
    res.status(400).send({ error: "Invalid token." });
  }
};

export const roleMiddleware = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req as any).userRole;

    if (!allowedRoles.includes(userRole)) {
      res.status(403).send({
        error: "Access denied. Insufficient permissions.",
        required: allowedRoles,
        current: userRole,
      });
      return;
    }
    next();
  };
};

// Middleware dla readonly użytkowników (GUEST)
export const readOnlyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userRole = (req as any).userRole;
  const method = req.method;

  if (userRole === Role.GUEST && !["GET", "HEAD", "OPTIONS"].includes(method)) {
    res.status(403).json({
      error: "Read-only access. Guests can only view data.",
    });
    return;
  }
  next();
};
