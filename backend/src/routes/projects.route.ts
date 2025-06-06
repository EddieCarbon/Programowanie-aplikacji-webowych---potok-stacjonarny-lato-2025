import express from "express";
import { projectsController } from "../controllers/projects.controller";

export const projectsRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Projects
 *     description: Operacje na projektach
 *
 * /api/projects:
 *   get:
 *     tags: [Projects]
 *     summary: Pobierz listę projektów
 *     responses:
 *       200:
 *         description: Lista projektów
 *   post:
 *     tags: [Projects]
 *     summary: Utwórz nowy projekt
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Projekt utworzony
 *       400:
 *         description: Błędne dane wejściowe
 *
 * /api/projects/{id}:
 *   get:
 *     tags: [Projects]
 *     summary: Pobierz projekt po ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Szczegóły projektu
 *       404:
 *         description: Projekt nie znaleziony
 *   put:
 *     tags: [Projects]
 *     summary: Zaktualizuj projekt po ID
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
 *         description: Projekt zaktualizowany
 *       400:
 *         description: Błędne dane wejściowe
 *   patch:
 *     tags: [Projects]
 *     summary: Częściowo zaktualizuj projekt po ID
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
 *         description: Projekt częściowo zaktualizowany
 *       404:
 *         description: Projekt nie znaleziony
 *   delete:
 *     tags: [Projects]
 *     summary: Usuń projekt po ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Projekt usunięty
 *       400:
 *         description: Brak ID projektu
 */

projectsRouter.get("/", projectsController.getProjects);
projectsRouter.get("/:id", projectsController.getProject);
projectsRouter.post("/", projectsController.createProject);
projectsRouter.put("/:id", projectsController.updateProject);
projectsRouter.patch("/:id", projectsController.patchProject);
projectsRouter.delete("/:id", projectsController.removeProject);
