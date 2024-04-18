// 2. Create the Controller
import { Request, Response } from "express";
import CommentModel, { IComment } from "../models/CommentsModel.js";

class CommentController {
  async createComment(req: Request, res: Response) {
    try {
      const { text, userId, movieId } = req.body;
      const comment = await CommentModel.create({ text, userId, movieId });
      return res
        .status(201)
        .json({ message: "Comment created successfully", comment });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async getCommentsByMovieId(req: Request, res: Response) {
    try {
      const { movieId } = req.params;
      const comments = await CommentModel.find({ movieId });
      return res.json(comments);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async updateComment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { text } = req.body;
      const comment = await CommentModel.findByIdAndUpdate(
        id,
        { text },
        { new: true }
      );
      if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
      }
      return res.json({ message: "Comment updated successfully", comment });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async deleteComment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const comment = await CommentModel.findByIdAndDelete(id);
      if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
      }
      return res.json({ message: "Comment deleted successfully", comment });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default new CommentController();
