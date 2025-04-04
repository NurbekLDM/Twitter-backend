  import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwtConfig from "../config/jwtConfig.js";
import { uploadImage } from "../middlewares/uploadMiddleware.js";
import supabase from "../config/db.js";
import postModel from "../models/postModel.js";


const authController = {
  async register(req, res) {
    try {
      const { email, password, username, full_name } = req.body;

      const existingUser = await userModel.findByEmail(email);
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "User with this email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const userData = {
        email,
        username,
        full_name,
        provider: "local",
        password: hashedPassword,
      };

      const newUser = await userModel.create(userData);
      console.log("New User:", newUser);
      if (!newUser) {
        return res.status(500).json({ message: "User could not be created" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: newUser.id, email: newUser.email },
        jwtConfig.secret,
        { expiresIn: jwtConfig.expiresIn }
      );

      // Set token in cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      // Remove password from response
      delete newUser.password;
      res.header("Authorization", `Bearer ${token}`);
      return res.status(201).json({
        message: "User registered successfully",
        user: newUser,
        token: token,
      });
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await userModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        jwtConfig.secret,
        { expiresIn: jwtConfig.expiresIn }
      );

      // Set token in cookie
      res.cookie("token", token, {
        httpOnly: false,
        path: "/",
        secure: false,
        sameSite: "Lax",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      // Remove password from response
      delete user.password;

      return res.status(200).json({
        message: "Login successful",
        user,
        token
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },
  async logout(req, res) {
    try {
      res.clearCookie("token");
      return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      console.error("Logout error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },
  
  async socialLogin(req, res) {
    try {
      const { email, full_name, username, profile_picture, provider } = req.body;
      const userData = {
        email,
        full_name,
        username,
        profile_picture,
        provider,
      };
  
      const user = await userModel.socialLogin(userData); 
      if (!user || user.length === 0) {
        return res.status(500).json({ message: "Failed to create or update user" });
      }
      const existingUser = user[0];
  
      const token = jwt.sign(
        { id: existingUser.id, email: existingUser.email },
        jwtConfig.secret,
        { expiresIn: jwtConfig.expiresIn }
      );
  
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });
  
      return res.status(200).json({ message: "Login successful", user: existingUser });
    } catch (error) {
      console.error("Social login error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  async  updateProfile(req, res) {
    try {
      const { full_name, username, bio } = req.body;
      const imageUrl = req.file ? await uploadImage(req.file, "profile") : null;
      console.log("Image URL:", imageUrl);
  
      const updateData = { full_name, username, bio };
      if (imageUrl) updateData.profile_picture = imageUrl;
  
      const updatedUser = await userModel.update(req.user.id, updateData);
      return res.json({ message: "Profile updated", user: updatedUser });
    } catch (error) {
      console.error("Error updating profile:", error);
      return res.status(500).json({ error: error.message });
    }
  },

  async getUserFollowed(req, res) {
    try {
      const {id: userId} = req.user;
      const posts = await userModel.getUserFollowed(userId);
      return res.json({ data: posts });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async getUserById(req, res) {
    try {
      const user = await req.user;
      console.log("User:", user);
      delete user.password;
      if (!user) return res.status(404).json({ message: "User not found" });
  
      return res.json({ user });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async followUser(req, res) {
    try {
      const { followingId } = req.body;
      const followerId = req.user.id;
      if (followerId === followingId) {
        return res.status(400).json({ message: "Cannot follow yourself" });
      }
      const followRecord = await userModel.followUser(followerId, followingId);
      return res.json({ follow: followRecord });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async unfollowUser(req, res) {
    try {
      const { followingId } = req.body;
      const followerId = req.user.id;
      const result = await userModel.unfollowUser(followerId, followingId);
      return res.json({ unfollowed: result });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async getFollowingCount(req, res) {
    try {
      const userId = req.user.id;
      
      
      const count = await userModel.getFollowingCount(userId);
      return res.json({ followingCount: count });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async getFollowersCount(req, res) {
    try {
      const userId = req.user.id;
      const count = await userModel.getFollowersCount(userId);
      return res.json({ followersCount: count });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

async getUsers(req, res) {
    try {
      const users = await userModel.getUsers();
      return res.json({ data: users });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

async getRecommendedUsers(req, res) {
    try {
      const userId = req.user.id;
      const users = await userModel.getRecommendedUsers(userId);
      return res.json({ data: users });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
},

async getUserFollowingUserPosts(req, res) {
  try {
      const userId = req.user.id;

      const followingIds = await userModel.getFollowingIds(userId);


      const posts = await postModel.findByUserId(followingIds);

      res.status(200).json(posts);
  } catch (error) {
      res.status(500).json({ message: "Internal Server Error", error });
  }
},



async changePassword(req, res) {
    try {
      const { oldPassword, newPassword } = req.body;
      const userId = req.user.id;

      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      await userModel.update(userId, { password: hashedNewPassword });

      return res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("Change password error:", error);
      return res.status(500).json({ message: "Server error" });
    }
}

};

export default authController;
