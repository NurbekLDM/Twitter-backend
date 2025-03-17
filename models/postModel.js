const db = require('../config/db');

const Post = {
    create: async (user_id, image, text) => {
        return db.one(
            'INSERT INTO posts (user_id, image, text) VALUES ($1, $2, $3) RETURNING *',
            [user_id, image, text]
        );
    },

    getAll: async () => {
        return db.any('SELECT * FROM posts ORDER BY date DESC');
    }
};

module.exports = Post;
