import postModel from "../models/postModel.js";
import likeHistoryModel from "../models/likeHistoryModel.js";
import bookmarkModel from "../models/bookmarkModel.js";

const postController = {
  async createPost(req, res) {
    try {
      const file = req.file;
      let imageUrl = null;
      if (file) {
        const { originalname, buffer } = file;
        const filePath = `posts/${Date.now()}-${originalname}`;
        const { data: storageData, error: storageError } =
          await supabase.storage
            .from("post-image")
            .upload(filePath, buffer, { upsert: false });
        if (storageError) throw storageError;
        const { data: publicUrlData } = supabase.storage
          .from("post-image")
          .getPublicUrl(filePath);
        imageUrl = publicUrlData.publicUrl;
      }
      const newPost = await postModel.create({
        user_id: req.user.id,
        text: req.body.text,
        image: imageUrl,
      });
      return res.status(201).json(newPost);
    } catch (error) {
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
      const posts = await postModel.findByUserId(req.params.userId);
      return res.json(posts);
    } catch (error) {
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

  async likePost(req, res) {
    try {
      const postId = req.params.id;
      await likeHistoryModel.create(req.user.id, postId);
      await postModel.incrementLikes(postId);
      return res.json({ message: "Post liked" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async unlikePost(req, res) {
    try {
      const postId = req.params.id;
      await likeHistoryModel.delete(req.user.id, postId);
      await postModel.decrementLikes(postId);
      return res.json({ message: "Post unliked" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
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
