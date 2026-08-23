import mongoose from "mongoose";
import { Project } from "../models/Project.js";

// to get published project
export async function list(req, res, next) {
  try {
    const sort = req.query.sort || "new";
    const sortMap = {
      new: { published: -1, createdAt: -1 },
      views: { views: -1, publishedAt: -1 },
      likes: { likes: -1, publishedAt: -1 },
    };

    const items = await Project.find({ published: true })
      .select("+likedBy")
      .sort(sortMap[sort] || sortMap.new)
      .limit(10)
      .populate("user", "name");

    const meId = req.user._id?.toString();
    const projects = items.map((p) => {
      const card = p.toPublicCard({ withHtml: true });

      card.isOwn = Boolean(meId && p.user?._id?.toString() === meId);
      card.likedByme = ((meId && p.likedBy) || []).some(
        (id) => id.toString() === meId,
      );

      return card;
    });

    res.json({
      projects,
    });
  } catch (error) {
    next(error);
  }
}

// to get one published project
export async function get(req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({
        error: "invalid project id",
      });

    const project = await Project.findById(req.params.id)
      .select("+viewedBy +likedBy")
      .populate("user", "name");

    if (!project || !project.published) {
      return res.status(404).json({
        error: "project not found",
      });
    }

    const meId = req.user?._id?.toString();
    const ownerId = project.user?._id?.toString();
    const isOwn = Boolean(meId && ownerId === meId);
    const alreadyViewed =
      meId && (project.viewedBy || []).some((id) => id.toString() === meId);

    if (meId && !isOwn && !alreadyViewed) {
      await Project.updateOne(
        { _id: project._id },
        {
          $addToSet: {
            viewedBy: req.user._id,
          },
          $inc: {
            views: 1,
          },
        },
      );
      project.views += 1;
    }
    const likedByMe = Boolean(
      meId && (project.likedBy || []).some((id) => id.toString() === meId),
    );

    res.json({
      project: {
        ...project.toPublicCard({}),
        html: project.html,
        isOwn,
        likedByMe,
      },
    });
  } catch (error) {
    next(error);
  }
}



// to toggle like or unlike a project.
export async function toggleLike(req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ error: "Invalid id" });

    const project = await Project.findOne({
      _id: req.params.id,
      published: true,
    }).select("+likedBy");

    if (!project) return res.status(404).json({ error: "Not found" });

    const meId = req.user._id.toString();

    if (project.user.toString() === meId)
      return res.status(403).json({ error: "You can't like your own project" });

    const idx = (project.likedBy || []).findIndex(
      (id) => id.toString() === meId,
    );
    let liked;
    if (idx === -1) {
      await Project.updateOne(
        { _id: project._id },
        { $addToSet: { likedBy: req.user._id }, $inc: { likes: 1 } },
      );
      liked = true;
    } else {
      await Project.updateOne(
        { _id: project._id },
        { $pull: { likedBy: req.user._id }, $inc: { likes: -1 } },
      );
      liked = false;
    }
    
    const fresh = await Project.findById(project._id).select("likes");

    res.json({ likes: Math.max(0, fresh?.likes ?? 0), liked });
  } catch (err) {
    next(err);
  }
}
