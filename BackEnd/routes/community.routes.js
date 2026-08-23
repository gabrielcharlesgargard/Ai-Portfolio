import express from "express";
import { optionAuth, requireAuth } from "../middleware/Auth.js";
import { list, get, toggleLike } from "../controllers/communityController.js";

const communityRouter = express.Router();

communityRouter.get("/", optionAuth, list);
communityRouter.get("/:id", optionAuth, get);
communityRouter.post("/:id/like", requireAuth, toggleLike);

export default communityRouter;
