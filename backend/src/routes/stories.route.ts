import express from "express";
import { storiesController } from "../controllers/stories.controller";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Stories
 *     description: Operacje na story
 *
 * /api/stories:
 *   get:
 *     tags: [Stories]
 *     summary: Pobierz listę story
 *     responses:
 *       200:
 *         description: Lista story
 *   post:
 *     tags: [Stories]
 *     summary: Utwórz nowe story
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Story utworzone
 *       400:
 *         description: Błędne dane wejściowe
 *
 * /api/stories/{id}:
 *   get:
 *     tags: [Stories]
 *     summary: Pobierz story po ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Szczegóły story
 *       404:
 *         description: Story nie znalezione
 *   put:
 *     tags: [Stories]
 *     summary: Zaktualizuj story po ID
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
 *         description: Story zaktualizowane
 *       400:
 *         description: Błędne dane wejściowe
 *   patch:
 *     tags: [Stories]
 *     summary: Częściowo zaktualizuj story po ID
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
 *         description: Story częściowo zaktualizowane
 *       404:
 *         description: Story nie znalezione
 *   delete:
 *     tags: [Stories]
 *     summary: Usuń story po ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Story usunięte
 *       400:
 *         description: Brak ID story
 */

router.get("/", storiesController.getStories);
router.get("/:id", storiesController.getStory);
router.post("/", storiesController.createStory);
router.put("/:id", storiesController.updateStory);
router.patch("/:id", storiesController.patchStory);
router.delete("/:id", storiesController.removeStory);

export const storiesRouter = router;
