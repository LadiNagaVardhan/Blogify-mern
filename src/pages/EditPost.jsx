import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { useFeedback } from '../context/FeedbackContext';
import '../css/EditPost.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function EditPost() {
  const { showToast } = useFeedback();
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Technology');
  const [image, setImage] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const categories = ['Technology', 'Programming', 'Web Development', 'Database', 'Career', 'General'];

  useEffect(() => {
    if (!token || !user) {
      navigate('/login');
      return;
    }

    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/posts/${id}`);
        const post = response.data;
        
        // Ownership verification: only author can edit
        if (post.author && post.author._id !== user.id) {
          setError('You are not authorized to edit this post.');
          setLoading(false);
          setTimeout(() => {
            navigate('/blogs');
          }, 2000);
          return;
        }

        setTitle(post.title);
        setSummary(post.summary);
        setContent(post.content);
        setCategory(post.category || 'General');
        setImage(post.image || '');
      } catch (err) {
        const errMsg = err.response?.data?.message || 'Failed to fetch post details.';
        setError(errMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title || !summary || !content) {
      setError('Please fill in all required fields (Title, Summary, and Content).');
      return;
    }

    try {
      setSaving(true);
      
      // PUT request to update the post
      await axios.put(
        `${API_URL}/api/posts/${id}`,
        { title, summary, content, category, image },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess('Post updated successfully! Redirecting...');
      showToast('Post updated successfully!', 'success');
      
      setTimeout(() => {
        navigate('/my-posts');
      }, 1200);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to update post.';
      setError(errMsg);
      showToast(errMsg, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="edit-post-page container">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="form-card">
          <header className="form-header">
            <h2>Edit Post</h2>
            <p>Update your published article details below</p>
          </header>

          {/* Block form if not authorized */}
          {error && !title ? (
            <div className="form-alert error-alert">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <span>{error}</span>
            </div>
          ) : (
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
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={saving}
                  required
                />
              </div>

              {/* Summary */}
              <div className="form-group">
                <label htmlFor="summary">Summary / Subtitle *</label>
                <input
                  id="summary"
                  type="text"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  disabled={saving}
                  required
                />
              </div>

              {/* Content */}
              <div className="form-group">
                <label htmlFor="content">Content *</label>
                <textarea
                  id="content"
                  rows="10"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  disabled={saving}
                  required
                ></textarea>
              </div>

              {/* Grid Row */}
              <div className="form-row">
                {/* Category select */}
                <div className="form-group flex-1">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={saving}
                  >
                    {categories.filter(c => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Image URL input */}
                <div className="form-group flex-1">
                  <label htmlFor="image">Image URL</label>
                  <input
                    id="image"
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    disabled={saving}
                  />
                </div>
              </div>

              {/* Actions buttons */}
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => navigate('/my-posts')} disabled={saving}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
