import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useFeedback } from '../context/FeedbackContext';
import '../css/Dashboard.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Dashboard() {
  const { showConfirm, showToast } = useFeedback();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalComments: 0,
    categoriesCount: 0,
    joinedDate: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      if (!token || !user) {
        navigate('/login');
        return;
      }

      // Fetch user profile
      const profileRes = await axios.get(`${API_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Fetch all posts to filter user posts
      const postsRes = await axios.get(`${API_URL}/api/posts?limit=1000`);
      const allPosts = postsRes.data.posts || postsRes.data || [];
      const userPosts = allPosts.filter(p => p.author && (p.author._id === user.id || p.author === user.id));

      // Fetch comments count for each user post
      const commentsPromises = userPosts.map(post => 
        axios.get(`${API_URL}/api/comments/${post._id}`)
          .then(res => res.data.length)
          .catch(() => 0) // fallback to 0 if fails
      );
      
      const commentCounts = await Promise.all(commentsPromises);
      const totalCommentsCount = commentCounts.reduce((sum, count) => sum + count, 0);

      // Unique categories count
      const categories = new Set(userPosts.map(p => p.category).filter(Boolean));

      setProfile(profileRes.data);
      setPosts(userPosts);
      setStats({
        totalPosts: userPosts.length,
        totalComments: totalCommentsCount,
        categoriesCount: categories.size,
        joinedDate: new Date(profileRes.data.createdAt).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      });
    } catch (err) {
      setError('Failed to fetch dashboard statistics. Please verify backend connectivity.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDelete = (postId, postTitle) => {
    showConfirm(
      'Delete Post',
      `Are you sure you want to permanently delete the post "${postTitle}"?`,
      async () => {
        try {
          setDeletingId(postId);
          await axios.delete(`${API_URL}/api/posts/${postId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          showToast('Post deleted successfully.', 'success');
          // Refresh statistics and data
          fetchDashboardData();
        } catch (err) {
          const errMsg = err.response?.data?.message || 'Failed to delete post.';
          showToast(errMsg, 'error');
          console.error(err);
          setDeletingId(null);
        }
      }
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="dashboard-page container">
      {error && <ErrorMessage message={error} />}

      {!error && (
        <>
          {/* Welcome Banner */}
          <header className="dashboard-header-banner">
            <div className="header-avatar-container">
              {profile?.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="dashboard-header-avatar" />
              ) : (
                <div className="dashboard-header-avatar-fallback">
                  {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </div>
            <div className="header-welcome-text">
              <h2>Welcome to your Dashboard, {profile?.name}!</h2>
              <p>Manage your posts, view statistics, and edit your profile settings in one central control panel.</p>
            </div>
            <div className="header-actions">
              <button className="dashboard-btn btn-new" onClick={() => navigate('/create-post')}>
                Write New Post
              </button>
              <button className="dashboard-btn btn-profile" onClick={() => navigate('/profile')}>
                Edit Profile
              </button>
            </div>
          </header>

          {/* Statistics Grid */}
          <section className="stats-grid">
            {/* Widget 1 */}
            <div className="stat-card stat-card-1">
              <div className="stat-icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              </div>
              <div className="stat-details">
                <span className="stat-value">{stats.totalPosts}</span>
                <span className="stat-label">Total Articles</span>
              </div>
            </div>

            {/* Widget 2 */}
            <div className="stat-card stat-card-2">
              <div className="stat-icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              </div>
              <div className="stat-details">
                <span className="stat-value">{stats.totalComments}</span>
                <span className="stat-label">Total Comments</span>
              </div>
            </div>

            {/* Widget 3 */}
            <div className="stat-card stat-card-3">
              <div className="stat-icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              </div>
              <div className="stat-details">
                <span className="stat-value">{stats.categoriesCount}</span>
                <span className="stat-label">Categories Used</span>
              </div>
            </div>

            {/* Widget 4 */}
            <div className="stat-card stat-card-4">
              <div className="stat-icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              </div>
              <div className="stat-details">
                <span className="stat-value font-small">{stats.joinedDate}</span>
                <span className="stat-label">Member Since</span>
              </div>
            </div>
          </section>

          {/* Posts Table Section */}
          <section className="dashboard-table-container">
            <div className="table-header-row">
              <h3>Manage Your Articles</h3>
              <span className="table-subtitle">Showing {posts.length} published articles</span>
            </div>

            {posts.length > 0 ? (
              <div className="scrollable-table-wrapper">
                <table className="dashboard-posts-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Created Date</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((post) => {
                      const createdDate = new Date(post.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      });

                      return (
                        <tr key={post._id}>
                          <td className="post-title-cell">
                            <span 
                              className="table-post-title-link"
                              onClick={() => navigate(`/posts/${post._id}`)}
                            >
                              {post.title}
                            </span>
                            <span className="table-post-summary">{post.summary}</span>
                          </td>
                          <td>
                            <span className="table-category-badge">{post.category || 'General'}</span>
                          </td>
                          <td className="date-cell">{createdDate}</td>
                          <td>
                            <div className="table-actions-group">
                              <button 
                                className="table-btn btn-view" 
                                onClick={() => navigate(`/posts/${post._id}`)}
                                disabled={deletingId === post._id}
                              >
                                View
                              </button>
                              <button 
                                className="table-btn btn-edit" 
                                onClick={() => navigate(`/edit-post/${post._id}`)}
                                disabled={deletingId === post._id}
                              >
                                Edit
                              </button>
                              <button 
                                className="table-btn btn-delete" 
                                onClick={() => handleDelete(post._id, post.title)}
                                disabled={deletingId === post._id}
                              >
                                {deletingId === post._id ? 'Deleting...' : 'Delete'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="dashboard-table-empty">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="empty-icon"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
                <h4>No posts published yet</h4>
                <p>Start writing and share your developer knowledge with the community!</p>
                <button className="dashboard-btn btn-new" onClick={() => navigate('/create-post')}>
                  Create Your First Post
                </button>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
