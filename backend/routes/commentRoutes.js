const express = require('express');
const router = express.Router();
const { addComment, getCommentsByPost, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

// Mount routes: mapped to /api/comments in server.js
router.route('/:postId')
  .post(protect, addComment)
  .get(getCommentsByPost);

router.route('/:commentId')
  .delete(protect, deleteComment);

module.exports = router;
