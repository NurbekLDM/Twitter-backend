import express from "express";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/uploadMiddleware.js";
import authController from "../controllers/authController.js";

const router = express.Router();
const { register, login, logout, uploadProfilePicture, getProfilePicture } =
  authController;

router.put(
  "/profile-picture",
  auth,
  upload.single("profile_picture"),
  uploadProfilePicture
);
router.get("/profile-picture/:id", getProfilePicture);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

export default router;
