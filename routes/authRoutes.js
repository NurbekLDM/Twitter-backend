import express from "express";
import auth from "../middlewares/auth.js";
import authController from "../controllers/authController.js";
  import upload from "../middlewares/upload.js";



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
  getUsers,
  getRecommendedUsers,
  getUserFollowed
} = authController;


router.get("/me", auth, getUserById)
router.get("/all", getUsers);
router.get("/userFollowed", auth, getUserFollowed);
router.get("/recommended", auth, getRecommendedUsers);
router.post("/register", register);
router.post("/login", login);
router.put("/update", auth, upload.single("profile"), updateProfile);
router.post("/logout", logout);
router.post("/follow",  auth, followUser);
router.post("/unfollow", auth, unfollowUser);
router.get("/following-count", auth, getFollowingCount);
router.get("/followers-count", auth, getFollowersCount);
router.post("/social-login", socialLogin);

export default router;
