const Post = require('../models/Post');

// @desc    Create a new blog post
// @route   POST /api/posts
// @access  Private (Requires JWT token)
const createPost = async (req, res) => {
  try {
    const { title, summary, content, category, image } = req.body;

    // Validate fields
    if (!title || !summary || !content) {
      return res.status(400).json({ message: 'Please add title, summary, and content.' });
    }

    // Save post, assigning author from req.user (attached by authMiddleware)
    const post = await Post.create({
      title,
      summary,
      content,
      category: category || 'General',
      image: image || '',
      author: req.user._id,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all blog posts (latest first)
// @route   GET /api/posts
// @access  Public
const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const totalPosts = await Post.countDocuments();
    const totalPages = Math.ceil(totalPosts / limit);

    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'name'); // Populate author name only

    res.status(200).json({
      posts,
      page,
      totalPages,
      totalPosts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get details of a single post
// @route   GET /api/posts/:id
// @access  Public
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email'); // Populate author details

    if (!post) {
      return res.status(404).json({ message: 'Blog post not found.' });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an existing post
// @route   PUT /api/posts/:id
// @access  Private (Owner only)
const updatePost = async (req, res) => {
  try {
    const { title, summary, content, category, image } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Blog post not found.' });
    }

    // Verify ownership: only creator can edit
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized. You do not own this post.' });
    }

    // Apply updates
    post.title = title || post.title;
    post.summary = summary || post.summary;
    post.content = content || post.content;
    post.category = category || post.category;
    post.image = image !== undefined ? image : post.image;
    post.updatedAt = Date.now();

    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an existing post
// @route   DELETE /api/posts/:id
// @access  Private (Owner only)
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Blog post not found.' });
    }

    // Verify ownership: only creator can delete
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized. You do not own this post.' });
    }

    // Delete post
    await post.deleteOne();
    res.status(200).json({ message: 'Post removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search blog posts (by title, summary, content)
// @route   GET /api/posts/search
// @access  Public
const searchPosts = async (req, res) => {
  try {
    const q = req.query.q || '';
    const posts = await Post.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { summary: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } }
      ]
    }).populate('author', 'name');

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get posts by category
// @route   GET /api/posts/category/:category
// @access  Public
const getPostsByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const posts = await Post.find({ category })
      .sort({ createdAt: -1 })
      .populate('author', 'name');

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get latest 5 posts
// @route   GET /api/posts/recent
// @access  Public
const getRecentPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('author', 'name');

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  searchPosts,
  getPostsByCategory,
  getRecentPosts,
};
