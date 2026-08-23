import express from "express";
import { requireAuth } from "../middleware/Auth.js";
import {
  list,
  create,
  get,
  update,
  deleteProject,
  generate,
} from "../controllers/project.controller.js";
import { githubRoute, vercelRoute } from "./project.deploy.js";
import { loadOwnedProject } from "../controllers/project.controller.js";

const projectRouter = express.Router();

projectRouter.get("/", requireAuth, list);
projectRouter.post("/", requireAuth, create);

projectRouter.get("/:id", requireAuth, get);
projectRouter.patch("/:id", requireAuth, update);

projectRouter.delete("/:id", requireAuth, deleteProject);
projectRouter.post("/:id/generate", requireAuth, generate);

// to deploy a project (on vercel) and create a repo on github
projectRouter.post("/:id/github", requireAuth, githubRoute(loadOwnedProject));
projectRouter.post("/:id/deploy", requireAuth, vercelRoute(loadOwnedProject));

export default projectRouter;
