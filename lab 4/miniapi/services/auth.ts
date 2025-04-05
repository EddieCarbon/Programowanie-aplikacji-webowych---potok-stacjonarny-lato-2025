import jwt from "jsonwebtoken";
import type { User, SafeUser } from "../models/user";
import { findUserByUsername } from "../db/userDb";

const tokenSecret = process.env.TOKEN_SECRET || "your_jwt_secret";
const refreshTokenSecret =
  process.env.REFRESH_TOKEN_SECRET || "your_refresh_secret";

// Symulacja bazy danych dla tokenów odświeżania
const refreshTokens: string[] = [];

export const authenticateUser = (
  username: string,
  password: string,
): User | null => {
  const user = findUserByUsername(username);
  if (!user || user.password !== password) {
    return null;
  }
  return user;
};

export const getSafeUser = (user: User): SafeUser => {
  const { password, ...safeUser } = user;
  return safeUser;
};

export const generateTokens = (user: User) => {
  // Token JWT wygasa po 15 minutach
  const token = jwt.sign(
    { userId: user.id, username: user.username, role: user.role },
    tokenSecret,
    { expiresIn: "15m" },
  );

  // Refresh token wygasa po 7 dniach
  const refreshToken = jwt.sign(
    { userId: user.id, username: user.username },
    refreshTokenSecret,
    { expiresIn: "7d" },
  );

  // Zapisz refresh token (normalnie w bazie danych)
  refreshTokens.push(refreshToken);

  return { token, refreshToken };
};

export const refreshAccessToken = (token: string) => {
  // Sprawdź czy refresh token istnieje
  if (!refreshTokens.includes(token)) {
    throw new Error("Invalid refresh token");
  }

  try {
    const decoded = jwt.verify(token, refreshTokenSecret) as {
      userId: number;
      username: string;
    };

    // Generuj nowy token dostępu
    const accessToken = jwt.sign(
      { userId: decoded.userId, username: decoded.username },
      tokenSecret,
      { expiresIn: "15m" },
    );

    return { token: accessToken };
  } catch (error) {
    // Usuń nieważny token
    const index = refreshTokens.indexOf(token);
    if (index !== -1) {
      refreshTokens.splice(index, 1);
    }
    throw new Error("Invalid refresh token");
  }
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, tokenSecret) as {
      userId: number;
      username: string;
      role: string;
    };
  } catch (error) {
    throw new Error("Invalid token");
  }
};
