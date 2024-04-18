import { Router } from "express";
import CommentController from "../controllers/CommentsController.js";
import { checkRoles } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/comments", checkRoles(["USER"]), CommentController.createComment);
router.get(
  "/comments/:movieId",
  checkRoles(["USER"]),
  CommentController.getCommentsByMovieId
);
router.put(
  "/comments/:id",
  checkRoles(["USER"]),
  CommentController.updateComment
);
router.delete(
  "/comments/:id",
  checkRoles(["USER"]),
  CommentController.deleteComment
);

export default router;
