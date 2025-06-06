import type { Request, Response } from "express";
import { storiesService } from "../services/stories.service";
import { Status } from "../models/enums/status.enum";

class StoriesController {
  async getStories(req: Request, res: Response) {
    try {
      const stories = await storiesService.getStories({});
      res.status(200).json(stories);
    } catch (error) {
      res.status(500).json((error as Error).message);
    }
  }

  async getStory(req: Request, res: Response) {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ error: "Invalid story ID" });
      return;
    }

    try {
      const story = await storiesService.getStory(id);
      if (story) {
        res.status(200).json(story);
      } else {
        res.status(404).json();
      }
    } catch (error) {
      res.status(500).json((error as Error).message);
    }
  }

  async createStory(req: Request, res: Response) {
    const storyData = {
      ...req.body,
      status: Status.TODO,
      creationDate: new Date(),
    };
    // const validationErrors =
    // if (validationErrors) {
    // res.status(400).send(validationErrors)
    // return
    // }
    try {
      const id = await storiesService.createStory(storyData);
      if (id) {
        res.status(201).json({ id });
      } else {
        res.status(500).json({ error: "Failed to create story" });
      }
    } catch (error) {
      res.status(500).json((error as Error).message);
    }
  }

  async updateStory(req: Request, res: Response) {
    const id = req.params.id;
    const { _id, ...story } = req.body;
    if (!id) {
      res.status(400).json({ error: "Invalid story ID" });
      return;
    }
    // const validationErrors = validateStoryWithoutId(story)
    //  if (validationErrors) {
    //  res.status(400).send(validationErrors)
    //  return
    // }
    try {
      const result = await storiesService.updateStory(id, story);
      res.status(200).json({ replaced: result });
    } catch (error) {
      res.status(500).json((error as Error).message);
    }
  }

  async patchStory(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "Invalid story ID" });
      return;
    }

    try {
      const result = await storiesService.patchStory(id, req.body);
      if (result) {
        res.status(200).json({ patched: result });
      } else {
        res.status(404).json({ error: "Story not found or update failed" });
      }
    } catch (error) {
      res.status(500).json((error as Error).message);
    }
  }

  async removeStory(req: Request, res: Response) {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ error: "Invalid story ID" });
      return;
    }

    try {
      const result = await storiesService.deleteStory(id);
      res.status(200).json({ deleted: result });
    } catch (error) {
      res.status(500).json((error as Error).message);
    }
  }
}

export const storiesController = new StoriesController();
