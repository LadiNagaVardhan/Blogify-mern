import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useFeedback } from '../context/FeedbackContext';
import '../css/CreatePost.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function CreatePost() {
  const { showToast } = useFeedback();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Technology');
  const [image, setImage] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const categories = ['Technology', 'Programming', 'Web Development', 'Database', 'Career', 'General'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Field validation
    if (!title || !summary || !content) {
      setError('Please fill in all required fields (Title, Summary, and Content).');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('You are not authorized. Please log in first.');
        navigate('/login');
        return;
      }

      // POST request to backend API with Auth Header
      const response = await axios.post(
        `${API_URL}/api/posts`,
        { title, summary, content, category, image },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess('Post published successfully! Redirecting...');
      showToast('Post created successfully!', 'success');
      
      // Clear inputs
      setTitle('');
      setSummary('');
      setContent('');
      setImage('');

      // Redirect to blogs after short delay
      setTimeout(() => {
        navigate('/blogs');
      }, 1200);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to publish post. Please try again.';
      setError(errMsg);
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-page container">
      <div className="form-card">
        <header className="form-header">
          <h2>Create New Post</h2>
          <p>Share your technical insights and stories with the community</p>
        </header>

        <form onSubmit={handleSubmit} className="post-form">
          {/* Error Alert */}
          {error && (
            <div className="form-alert error-alert">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <span>{error}</span>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="form-alert success-alert">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>{success}</span>
            </div>
          )}

          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">Post Title *</label>
            <input
              id="title"
              type="text"
              placeholder="e.g. Mastering React Hooks"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {/* Summary */}
          <div className="form-group">
            <label htmlFor="summary">Summary / Subtitle *</label>
            <input
              id="summary"
              type="text"
              placeholder="e.g. A comprehensive guide to understanding useState, useEffect and custom hooks."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {/* Content */}
          <div className="form-group">
            <label htmlFor="content">Content *</label>
            <textarea
              id="content"
              rows="10"
              placeholder="Write the full content of your article here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={loading}
              required
            ></textarea>
          </div>

          {/* Grid for Category and Image URL */}
          <div className="form-row">
            {/* Category Select */}
            <div className="form-group flex-1">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={loading}
              >
                {categories.filter(c => c !== 'All').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Image URL Input */}
            <div className="form-group flex-1">
              <label htmlFor="image">Image URL</label>
              <input
                id="image"
                type="url"
                placeholder="e.g. https://images.unsplash.com/... (optional)"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => navigate('/blogs')} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Publishing...' : 'Publish Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
