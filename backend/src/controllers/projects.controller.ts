import type { NextFunction, Request, Response } from "express";
import { projectsService } from "../services/projects.service";

class ProjectsController {
  async getProjects(req: Request, res: Response) {
    try {
      const projects = await projectsService.getProjects({});
      res.status(200).json(projects);
    } catch (error) {
      res.status(500).json((error as Error).message);
    }
  }

  async getProject(req: Request, res: Response) {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ error: "Invalid project ID" });
      return;
    }

    try {
      const project = await projectsService.getProject(id);
      if (project) {
        res.status(200).json(project);
      } else {
        res.status(404).json();
      }
    } catch (error) {
      res.status(500).json((error as Error).message);
    }
  }

  async createProject(req: Request, res: Response) {
    const project = req.body;
    // const validationErrors =
    // if (validationErrors) {
    // res.status(400).send(validationErrors)
    // return
    // }
    try {
      const id = await projectsService.createProject(project);
      if (id) {
        res.status(201).json({ id });
      } else {
        res.status(500).json({ error: "Failed to create project" });
      }
    } catch (error) {
      res.status(500).json((error as Error).message);
    }
  }

  async updateProject(req: Request, res: Response) {
    const id = req.params.id;
    const { _id, ...project } = req.body;
    if (!id) {
      res.status(400).json({ error: "Invalid project ID" });
      return;
    }
    // const validationErrors = validateProjectWithoutId(project)
    //  if (validationErrors) {
    //  res.status(400).send(validationErrors)
    //  return
    // }
    try {
      const result = await projectsService.updateProject(id, project);
      res.status(200).json({ replaced: result });
    } catch (error) {
      res.status(500).json((error as Error).message);
    }
  }

  async patchProject(req: Request, res: Response) {
    const id = req.params.id;
    const { _id, ...project } = req.body;
    if (!id) {
      res.status(400).json({ error: "Invalid project ID" });
      return;
    }
    // const validationErrors = validaPartialNote(note)
    // if (validationErrors) {
    //   res.status(400).send(validationErrors)
    //   return
    // }
    try {
      const result = await projectsService.patchProject(id, project);
      if (result) {
        res.status(200).json({ patched: result });
      } else {
        res.status(404).json({ error: "Project not found or update failed" });
      }
    } catch (error) {
      res.status(500).json((error as Error).message);
    }
  }

  async removeProject(req: Request, res: Response) {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ error: "Project ID is required" });
      return;
    }

    try {
      const result = await projectsService.deleteProject(id);
      res.status(200).json({ deleted: result });
    } catch (error) {
      res.status(500).json((error as Error).message);
    }
  }
}

export const projectsController = new ProjectsController();
