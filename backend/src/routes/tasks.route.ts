import express from "express";
import { tasksController } from "../controllers/tasks.controller";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Tasks
 *     description: Operacje na zadaniach
 *
 * /api/tasks:
 *   get:
 *     tags: [Tasks]
 *     summary: Pobierz listę zadań
 *     responses:
 *       200:
 *         description: Lista zadań
 *   post:
 *     tags: [Tasks]
 *     summary: Utwórz nowe zadanie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Zadanie utworzone
 *       400:
 *         description: Błędne dane wejściowe
 *
 * /api/tasks/{id}:
 *   get:
 *     tags: [Tasks]
 *     summary: Pobierz zadanie po ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Szczegóły zadania
 *       404:
 *         description: Zadanie nie znalezione
 *   put:
 *     tags: [Tasks]
 *     summary: Zaktualizuj zadanie po ID
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
 *         description: Zadanie zaktualizowane
 *       400:
 *         description: Błędne dane wejściowe
 *   patch:
 *     tags: [Tasks]
 *     summary: Częściowo zaktualizuj zadanie po ID
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
 *         description: Zadanie częściowo zaktualizowane
 *       404:
 *         description: Zadanie nie znalezione
 *   delete:
 *     tags: [Tasks]
 *     summary: Usuń zadanie po ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Zadanie usunięte
 *       400:
 *         description: Brak ID zadania
 */

router.get("/", tasksController.getTasks);
router.get("/:id", tasksController.getTask);
router.post("/", tasksController.createTask);
router.put("/:id", tasksController.updateTask);
router.patch("/:id", tasksController.patchTask);
router.delete("/:id", tasksController.removeTask);

export const tasksRouter = router;
