import express from "express";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/uploadMiddleware.js";
import postController from "../controllers/postController.js";

const router = express.Router();
router.get("/", postController.getPosts);
router.post("/create", auth, upload.single("image"), postController.createPost);
router.get("/:id", postController.getPostById);
router.put("/update/:id", auth, upload.single("image"), postController.updatePost);
router.delete("/delete/:id", auth, postController.deletePost);
router.post("/:id/like", auth, postController.likePost);
router.delete("/:id/unlike", auth, postController.unlikePost);
router.post("/:id/bookmark", auth, postController.bookmarkPost);
router.delete("/:id/unbookmark", auth, postController.unbookmarkPost);
router.get("/user/:userId", postController.getPostsByUser);

export default router;
