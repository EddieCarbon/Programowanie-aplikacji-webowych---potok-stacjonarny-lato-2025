import express from "express";
import cors from "cors";

import { tasksRouter } from "./src/routes/tasks.route";
import { projectsRouter } from "./src/routes/projects.route";
import { storiesRouter } from "./src/routes/stories.route";
import { authRouter } from "./src/routes/auth.route";
import { usersRouter } from "./src/routes/users.route";
import {
  authMiddleware,
  readOnlyMiddleware,
} from "./src/middleware/auth.middleware";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { options } from "./swagger";

const app = express();
const port = 8080;

app.use(express.json());
app.use(cors());

// swagger
const swaggerSpec = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Public routes
app.use("/api/auth", authRouter);

// Protected routes with role-based access
app.use("/api/users", authMiddleware, usersRouter);
app.use("/api/tasks", authMiddleware, readOnlyMiddleware, tasksRouter);
app.use("/api/projects", authMiddleware, readOnlyMiddleware, projectsRouter);
app.use("/api/stories", authMiddleware, readOnlyMiddleware, storiesRouter);

// Error handling
app.use((err: Error, req: any, res: any, next: any): void => {
  console.error(err);
  res.status(500).send({ error: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).send({ error: "Not Found!" });
});

app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
