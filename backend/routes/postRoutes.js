const express = require('express');
const router = express.Router();
const { createPost, getAllPosts, getPostById, updatePost, deletePost, searchPosts, getPostsByCategory, getRecentPosts } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

// Routes mapped to /api/posts in server.js
router.route('/')
  .post(protect, createPost)
  .get(getAllPosts);

// Content discovery routes (must be defined BEFORE dynamic :id parameter)
router.get('/search', searchPosts);
router.get('/recent', getRecentPosts);
router.get('/category/:category', getPostsByCategory);

router.route('/:id')
  .get(getPostById)
  .put(protect, updatePost)
  .delete(protect, deletePost);

module.exports = router;
