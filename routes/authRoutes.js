import express from "express";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/uploadMiddleware.js";
import authController from "../controllers/authController.js";

const router = express.Router();
const {
  register,
  login,
  logout,
  getUserById,
  followUser,
  unfollowUser,
  getFollowingCount,
  getFollowersCount,
  updateProfile,
  socialLogin,
} = authController;

router.put(
  "/profile-picture",
  auth,
  upload.single("profile_picture"),
  uploadProfilePicture
);
router.get("/user/:id", getUserById);
router.post("/register", register);
router.post("/login", login);
router.put("/update", auth, updateProfile);
router.post("/logout", logout);
router.post("/follow", auth, followUser);
router.delete("/unfollow", auth, unfollowUser);
router.get("/:id/following-count", auth, getFollowingCount);
router.get("/:id/followers-count", auth, getFollowersCount);
router.post("/social-login", socialLogin);

export default router;
