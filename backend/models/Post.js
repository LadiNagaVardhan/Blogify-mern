const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a post title'],
    },
    summary: {
      type: String,
      required: [true, 'Please add a summary'],
    },
    content: {
      type: String,
      required: [true, 'Please add post content'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: ['Technology', 'Programming', 'Web Development', 'Database', 'Career', 'General'],
      default: 'General',
    },
    image: {
      type: String,
      default: '',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  }
);

module.exports = mongoose.model('Post', postSchema);
