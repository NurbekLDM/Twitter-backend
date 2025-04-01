import commentModel from "../models/commentModel.js";
import commentHistoryModel from "../models/commentHistoryModel.js";

const commentController = {
  async createComment(req, res) {
    try {
      const newComment = await commentModel.create({
        post_id: req.body.post_id,
        user_id: req.user.id,
        text: req.body.text,
      });
      await commentHistoryModel.create(
        req.user.id,
        req.body.post_id,
        newComment.id
      );
      return res.status(201).json(newComment);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async getCommentsByPostId(req, res) {
    try {
      const comments = await commentModel.findByPostId(req.params.postId);
      return res.json({data: comments});
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async updateComment(req, res) {
    try {
      const updatedComment = await commentModel.update(
        req.params.commentId,
        req.user.id,
        { text: req.body.text }
      );
      return res.json(updatedComment);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async deleteComment(req, res) {
    try {
      await commentModel.delete(req.params.commentId, req.user.id);
      await commentHistoryModel.deleteByComment(req.params.commentId);
      return res.json({ message: "Comment deleted" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async likeComment(req, res) {
    try {
      const commentId = req.params.commentId;
      await commentModel.likeComment(req.user.id, commentId);
      return res.json({ message: "Comment liked" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async unlikeComment(req, res) {
    try {
      const commentId = req.params.commentId;
      await commentModel.unlikeComment(req.user.id, commentId);
      return res.json({ message: "Comment unliked" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async getUserLikedComments(req, res) {
    try {
      const likedComments = await commentModel.getUserLikedComments(req.user.id);
      return res.json(likedComments);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },


};

export default commentController;
