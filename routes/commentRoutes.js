import express from "express";
import auth from "../middlewares/auth.js";
import commentController from "../controllers/commentController.js";

const router = express.Router();

router.post("/create", auth, commentController.createComment);
router.get('/userLikedComments', auth, commentController.getUserLikedComments);
router.get("/all/:postId", commentController.getCommentsByPostId);
router.put("/update/:commentId", auth, commentController.updateComment);
router.delete("/delete/:commentId", auth, commentController.deleteComment);
router.post("/:commentId/like", auth, commentController.likeComment);
router.delete("/:commentId/unlike", auth, commentController.unlikeComment);

export default router;
