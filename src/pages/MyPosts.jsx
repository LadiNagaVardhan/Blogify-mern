import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { useFeedback } from '../context/FeedbackContext';
import '../css/MyPosts.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function MyPosts() {
  const { showConfirm, showToast } = useFeedback();
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  
  const fetchMyPosts = async () => {
  try {
    setLoading(true);

    const response = await axios.get(
      `${API_URL}/api/posts?limit=1000`
    );

    if (user && user.id) {
      const posts = response.data.posts || [];

      const filtered = posts.filter(
        (post) =>
          post.author &&
          post.author._id === user.id
      );

      setMyPosts(filtered);
    } else {
      setError('Session expired. Please log in again.');
      navigate('/login');
    }
  } catch (err) {
    setError(
      'Failed to fetch posts. Please make sure the backend is running.'
    );
    console.error(err);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  if (!token || !user) {
    navigate('/login');
    return;
  }

  fetchMyPosts();
}, []);

  const handleDelete = (id, title) => {
    showConfirm(
      'Delete Post',
      `Are you sure you want to delete this post: "${title}"?`,
      async () => {
        try {
          await axios.delete(`${API_URL}/api/posts/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          showToast('Post deleted successfully.', 'success');
          // Refresh posts list
          fetchMyPosts();
        } catch (err) {
          const errMsg = err.response?.data?.message || 'Failed to delete post.';
          showToast(errMsg, 'error');
        }
      }
    );
  };

  const gradients = [
    'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
    'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
    'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
    'linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)',
  ];

  return (
    <div className="myposts-page container">
      {/* Header */}
      <header className="myposts-header">
        <div>
          <h1 className="myposts-title">My Articles</h1>
          <p className="myposts-subtitle">Manage, edit, and delete your published blog posts</p>
        </div>
        <button className="create-shortcut-btn" onClick={() => navigate('/create-post')}>
          Write New Post
        </button>
      </header>

      {/* Main Area */}
      <section className="myposts-content">
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="myposts-error">
            <p>{error}</p>
          </div>
        ) : myPosts.length > 0 ? (
          <div className="myposts-grid">
            {myPosts.map((post, index) => {
              const formattedDate = new Date(post.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              });
              const cardGradient = gradients[index % gradients.length];

              return (
                <div key={post._id} className="mypost-card">
                  {/* Card Image */}
                  <div className="mypost-card-image" style={{ background: cardGradient }}>
                    <span className="mypost-badge">{post.category || 'General'}</span>
                    <span className="mypost-overlay-logo">BLOGIFY</span>
                  </div>

                  {/* Card Content */}
                  <div className="mypost-card-body">
                    <span className="mypost-card-date">{formattedDate}</span>
                    <h3 className="mypost-card-title">{post.title}</h3>
                    <p className="mypost-card-summary">{post.summary}</p>
                    
                    {/* Action Controls */}
                    <div className="mypost-card-actions">
                      <button 
                        className="btn-view-post" 
                        onClick={() => navigate(`/posts/${post._id}`)}
                      >
                        View
                      </button>
                      <button 
                        className="btn-edit-post" 
                        onClick={() => navigate(`/edit-post/${post._id}`)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn-delete-post" 
                        onClick={() => handleDelete(post._id, post.title)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="myposts-empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="empty-icon"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
            <h3>You haven't written any posts yet</h3>
            <p>Ready to share your developer journey? Write and publish your first article on Blogify.</p>
            <button className="reset-btn" onClick={() => navigate('/create-post')}>
              Write Your First Post
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
