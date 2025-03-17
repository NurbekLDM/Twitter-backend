const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../config/multer'); 

router.post('/', authMiddleware, upload.single('image'), postController.createPost);
router.get('/', postController.getAllPosts);

module.exports = router;
