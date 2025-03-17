const Post = require('../models/postModel');

const postController = {
    createPost: async (req, res) => {
        const { text } = req.body;
        const user_id = req.user.id;
        const image = req.file ? `/uploads/${req.file.filename}` : null; // Fayl yo‘li

        try {
            const newPost = await Post.create(user_id, image, text);
            res.json(newPost);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getAllPosts: async (req, res) => {
        try {
            const posts = await Post.getAll();
            res.json(posts);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};

module.exports = postController;
