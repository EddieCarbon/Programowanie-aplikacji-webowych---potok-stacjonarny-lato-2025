import express from "express";
import { authController } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

export const authRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Operacje autoryzacyjne
 *
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Logowanie użytkownika
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Zalogowano pomyślnie
 *       400:
 *         description: Brak wymaganych danych
 *       401:
 *         description: Nieprawidłowe dane logowania
 *
 * /api/auth/google:
 *   post:
 *     tags: [Auth]
 *     summary: Logowanie przez Google
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Zalogowano przez Google
 *       400:
 *         description: Brak tokena Google
 *
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Rejestracja użytkownika
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [ADMIN, DEVELOPER, MANAGER]
 *     responses:
 *       201:
 *         description: Zarejestrowano pomyślnie
 *       400:
 *         description: Brak wymaganych danych
 *       409:
 *         description: Użytkownik już istnieje
 *
 * /api/auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Odśwież token JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Nowy token JWT
 *       400:
 *         description: Brak tokena odświeżania
 *       401:
 *         description: Nieprawidłowy token odświeżania
 *
 * /api/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Pobierz dane zalogowanego użytkownika
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dane użytkownika
 *       404:
 *         description: Użytkownik nie znaleziony
 */

// Public routes
authRouter.post("/login", authController.login);
authRouter.post("/google", authController.googleLogin);
authRouter.post("/register", authController.register);
authRouter.post("/refresh", authController.refreshToken);

// Protected routes
authRouter.get("/me", authMiddleware, authController.getCurrentUser);
