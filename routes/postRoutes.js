import express from "express";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";
import postController from "../controllers/postController.js";

const router = express.Router()
router.get("/", auth, postController.getPosts);
router.post("/create", auth, upload.single("post-image"), postController.createPost);
router.get("/userPost", auth, postController.getPostsByUser);
router.get("/likedPosts", auth, postController.getUserLikedPosts);
router.get("/bookmarkedPosts", auth, postController.getbookMarkedPostsByUser);
router.get("/:id", auth, postController.getPostById);
router.put("/update/:id", auth, upload.single("post-image"), postController.updatePost);
router.delete("/delete/:id", auth, postController.deletePost);
router.post("/:id/bookmark", auth, postController.bookmarkPost);
router.delete("/:id/unbookmark", auth, postController.unbookmarkPost);
router.post("/:postId/like", auth, postController.likePost);
router.delete("/:postId/unlike", auth, postController.unlikePost);



export default router;
