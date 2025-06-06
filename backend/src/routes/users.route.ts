import express from "express";
import { usersController } from "../controllers/users.controller";
import { roleMiddleware } from "../middleware/auth.middleware";
import { Role } from "../models/enums/role.enum";

export const usersRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Operacje na użytkownikach
 *
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: Pobierz listę użytkowników
 *     responses:
 *       200:
 *         description: Lista użytkowników
 *
 * /api/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Pobierz użytkownika po ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Szczegóły użytkownika
 *       404:
 *         description: Użytkownik nie znaleziony
 *   put:
 *     tags: [Users]
 *     summary: Zaktualizuj użytkownika po ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Użytkownik zaktualizowany
 *       400:
 *         description: Błędne dane wejściowe
 *   patch:
 *     tags: [Users]
 *     summary: Częściowo zaktualizuj użytkownika po ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Użytkownik częściowo zaktualizowany
 *       404:
 *         description: Użytkownik nie znaleziony
 *   delete:
 *     tags: [Users]
 *     summary: Usuń użytkownika po ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Użytkownik usunięty
 *       400:
 *         description: Brak ID użytkownika
 */

usersRouter.get("/", usersController.getUsers);
usersRouter.get("/:id", usersController.getUser);
usersRouter.put(
  "/:id",
  roleMiddleware([Role.ADMIN]),
  usersController.updateUser,
);
usersRouter.patch(
  "/:id",
  roleMiddleware([Role.ADMIN]),
  usersController.patchUser,
);
usersRouter.delete(
  "/:id",
  roleMiddleware([Role.ADMIN]),
  usersController.removeUser,
);
