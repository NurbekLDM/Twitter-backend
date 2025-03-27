import postModel from "../models/postModel.js";
import likeHistoryModel from "../models/likeHistoryModel.js";
import bookmarkModel from "../models/bookmarkModel.js";
import supabase from "../config/db.js";
import { uploadImage } from "../middlewares/uploadMiddleware.js";
import likeModel from "../models/likeModel.js";

const postController = {
  async  createPost(req, res) {
    try {
      const { text } = req.body;
      const imageUrl = req.file ? await uploadImage(req.file, "post-image") : null;
  
      const newPost = await postModel.create({
        user_id: req.user.id,
        text,
        image: imageUrl,
      });
  
      return res.status(201).json(newPost);
    } catch (error) {
      console.error("Error creating post:", error);
      return res.status(500).json({ error: error.message });
    }
  },

  async getPosts(req, res) {
    try {
      const posts = await postModel.findAll();
      return res.json(posts);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async getPostById(req, res) {
    try {
      const post = await postModel.findById(req.params.id);
      if (!post) return res.status(404).json({ message: "Post not found" });
      return res.json(post);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async getPostsByUser(req, res) {
    try {
      const id = req.user?.id;
      if (!id) {
       console.log("User id is not found")
        return res.status(404).json({ message: "User id not found" });
    } 
      console.log("User:", req.user.id);
      console.log(req.user?.id)
      const posts = await postModel.findByUserId(id);
      console.log("Posts:", posts);
      return res.json(posts);
    } catch (error) {
      console.log("User id:", req.user.id);
      return res.status(500).json({ error: error.message });
    }
  },

  async updatePost(req, res) {
    try {
      const file = req.file;
      let imageUrl;
      if (file) {
        const { originalname, buffer } = file;
        const filePath = `posts/${Date.now()}-${originalname}`;
        const { error: storageError } = await supabase.storage
          .from("post-image")
          .upload(filePath, buffer, { upsert: false });
        if (storageError) throw storageError;
        const { data: publicUrlData } = supabase.storage
          .from("post-image")
          .getPublicUrl(filePath);
        imageUrl = publicUrlData.publicUrl;
      }
      const updatedPost = await postModel.update(req.params.id, req.user.id, {
        text: req.body.text,
        image: imageUrl,
      });
      return res.json(updatedPost);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async deletePost(req, res) {
    try {
      await postModel.delete(req.params.id, req.user.id);
      return res.json({ message: "Post deleted" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },


  async  likePost(req, res) {
    try {
      const { id: userId } = req.user;
      const { postId } = req.params;
  
      const result = await likeModel.likePost(userId, postId);
      return res.json(result);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  
  async unlikePost(req, res) {
    try {
      const { id: userId } = req.user;
      const { postId } = req.params;
  
      const result = await likeModel.unlikePost(userId, postId);
      return res.json(result);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  
  async  getUserLikedPosts(req, res) {
    try {
      const { id: userId } = req.user;
      const likedPosts = await likeModel.getLikedPostsByUser(userId);
      return res.json({ data: likedPosts });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async getbookMarkedPostsByUser(req , res) {
    try{
    const bookmarkedPosts = await bookmarkModel.getBookmarkedPostsByUser();
    return res.json({ data: bookmarkedPosts });
    } catch (error) {
       console.log(error)
    }
    
    
  },

  async bookmarkPost(req, res) {
    try {
      const postId = req.params.id;
      await bookmarkModel.create(req.user.id, postId);
      return res.json({ message: "Post bookmarked" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async unbookmarkPost(req, res) {
    try {
      const postId = req.params.id;
      await bookmarkModel.delete(req.user.id, postId);
      return res.json({ message: "Post unbookmarked" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};

export default postController;
