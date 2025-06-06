import type { Request, Response } from "express";
import { tasksService } from "../services/tasks.service";
import { Status } from "../models/enums/status.enum";

class TasksController {
  async getTasks(req: Request, res: Response) {
    try {
      const tasks = await tasksService.getTasks({});
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json((error as Error).message);
    }
  }

  async getTask(req: Request, res: Response) {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ error: "Invalid task ID" });
      return;
    }

    try {
      const task = await tasksService.getTask(id);
      if (task) {
        res.status(200).json(task);
      } else {
        res.status(404).json();
      }
    } catch (error) {
      res.status(500).json((error as Error).message);
    }
  }

  async createTask(req: Request, res: Response) {
    const taskData = {
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
      const id = await tasksService.createTask(taskData);
      if (id) {
        res.status(201).json({ id });
      } else {
        res.status(500).json({ error: "Failed to create task" });
      }
    } catch (error) {
      res.status(500).json((error as Error).message);
    }
  }

  async updateTask(req: Request, res: Response) {
    const id = req.params.id;
    const { _id, ...task } = req.body;
    if (!id) {
      res.status(400).json({ error: "Invalid task ID" });
      return;
    }
    // const validationErrors = validateTaskWithoutId(task)
    //  if (validationErrors) {
    //  res.status(400).send(validationErrors)
    //  return
    // }
    try {
      const result = await tasksService.updateTask(id, task);
      res.status(200).json({ replaced: result });
    } catch (error) {
      res.status(500).json((error as Error).message);
    }
  }

  async patchTask(req: Request, res: Response) {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (!id) {
      res.status(400).json({ error: "Invalid task ID" });
      return;
    }

    // Handle status changes with date tracking
    if (updateData.status === Status.DOING && !updateData.startDate) {
      updateData.startDate = new Date();
    } else if (
      updateData.status === Status.DONE &&
      !updateData.completionDate
    ) {
      updateData.completionDate = new Date();
    }

    try {
      const result = await tasksService.patchTask(id, updateData);
      if (result) {
        res.status(200).json({ patched: result });
      } else {
        res.status(404).json({ error: "Task not found or update failed" });
      }
    } catch (error) {
      res.status(500).json((error as Error).message);
    }
  }

  async removeTask(req: Request, res: Response) {
    const id = req.params.id;

    if (!id) {
      res.status(400).json({ error: "Invalid task ID" });
      return;
    }

    try {
      const result = await tasksService.deleteTask(id);
      res.status(200).json({ deleted: result });
    } catch (error) {
      res.status(500).json((error as Error).message);
    }
  }
}

export const tasksController = new TasksController();
