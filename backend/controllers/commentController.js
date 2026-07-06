const Comment = require('../models/Comment');

// @desc    Add a comment to a post
// @route   POST /api/comments/:postId
// @access  Private (JWT protected)
const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.postId;

    if (!text) {
      return res.status(400).json({ message: 'Comment text is required.' });
    }

    // Save comment
    const comment = await Comment.create({
      text,
      user: req.user._id, // attached by authMiddleware
      post: postId,
    });

    // Populate user name before returning
    await comment.populate('user', 'name');

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all comments for a post (newest first)
// @route   GET /api/comments/:postId
// @access  Public
const getCommentsByPost = async (req, res) => {
  try {
    const postId = req.params.postId;

    const comments = await Comment.find({ post: postId })
      .sort({ createdAt: -1 })
      .populate('user', 'name'); // Populate user name only

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:commentId
// @access  Private (Owner only)
const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found.' });
    }

    // Verify ownership: only comment author can delete
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized. You did not write this comment.' });
    }

    await comment.deleteOne();
    res.status(200).json({ message: 'Comment deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addComment,
  getCommentsByPost,
  deleteComment,
};
