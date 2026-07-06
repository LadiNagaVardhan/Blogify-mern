import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { useFeedback } from '../context/FeedbackContext';
import '../css/PostDetails.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function PostDetails() {
  const { showConfirm, showToast } = useFeedback();
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Comments state variables
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentError, setCommentError] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  // Fetch post details & comments on load
  useEffect(() => {
    const fetchPostDetailsAndComments = async () => {
      try {
        setLoading(true);
        // Parallel requests for post details and comments list
        const [postRes, commentsRes] = await Promise.all([
          axios.get(`${API_URL}/api/posts/${id}`),
          axios.get(`${API_URL}/api/comments/${id}`)
        ]);

        setPost(postRes.data);
        setComments(commentsRes.data);
      } catch (err) {
        const errMsg = err.response?.data?.message || 'Failed to fetch article details.';
        setError(errMsg);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPostDetailsAndComments();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentError('');

    if (!commentText.trim()) {
      setCommentError('Comment text cannot be empty.');
      return;
    }

    try {
      setSubmittingComment(true);
      const response = await axios.post(
        `${API_URL}/api/comments/${id}`,
        { text: commentText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Prepend new comment to list
      setComments((prev) => [response.data, ...prev]);
      setCommentText('');
      showToast('Comment added successfully!', 'success');
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to post comment. Please try again.';
      setCommentError(errMsg);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleCommentDelete = (commentId) => {
    showConfirm(
      'Delete Comment',
      'Are you sure you want to delete this comment?',
      async () => {
        try {
          await axios.delete(`${API_URL}/api/comments/${commentId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // Filter out deleted comment from state
          setComments((prev) => prev.filter((c) => c._id !== commentId));
          showToast('Comment deleted successfully.', 'success');
        } catch (err) {
          const errMsg = err.response?.data?.message || 'Failed to delete comment.';
          showToast(errMsg, 'error');
        }
      }
    );
  };

  // Gradients for cover image placeholder
  const gradients = [
    'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
    'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
    'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
    'linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)',
  ];

  const placeholderGradient = gradients[Math.abs(id ? id.charCodeAt(0) : 0) % gradients.length];

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !post) {
    return (
      <div className="details-error container">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="error-icon"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <h3>Article Not Found</h3>
        <p>{error || "The article you are looking for does not exist or was deleted."}</p>
        <button className="back-btn" onClick={() => navigate('/blogs')}>
          Back to Blogs
        </button>
      </div>
    );
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <article className="post-details-page container">
      {/* Back to blogs link */}
      <div className="back-nav">
        <Link to="/blogs" className="back-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Back to Articles
        </Link>
      </div>

      {/* Header Block */}
      <header className="details-header">
        <span className="details-badge">{post.category || 'General'}</span>
        <h1 className="details-title">{post.title}</h1>
        <p className="details-summary">{post.summary}</p>
        
        {/* Author / Date Meta */}
        <div className="details-meta">
          <div className="author-info">
            <div className="details-avatar">
              {post.author?.name ? post.author.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <span className="author-name">{post.author?.name || 'Anonymous'}</span>
              <span className="author-email">{post.author?.email || ''}</span>
            </div>
          </div>
          <div className="post-date">
            <span>Published on</span>
            <span>{formattedDate}</span>
          </div>
        </div>
      </header>

      {/* Cover Image Block */}
      {post.image ? (
        <div className="details-cover-image">
          <img src={post.image} alt={post.title} onError={(e) => { e.target.style.display = 'none'; }} />
        </div>
      ) : (
        <div className="details-cover-image placeholder" style={{ background: placeholderGradient }}>
          <span>BLOGIFY ARTICLE</span>
        </div>
      )}

      {/* Body content */}
      <section className="details-content">
        {post.content.split('\n').map((paragraph, index) => {
          if (paragraph.trim() === '') return null;
          return <p key={index}>{paragraph}</p>;
        })}
      </section>

      {/* Comments Section */}
      <section className="comments-section">
        <h3 className="comments-heading">Discussion ({comments.length})</h3>

        {/* Add Comment Form */}
        {token && user ? (
          <form onSubmit={handleCommentSubmit} className="add-comment-form">
            {commentError && <div className="comment-error">{commentError}</div>}
            <textarea
              placeholder="Join the discussion... Share your thoughts."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={submittingComment}
              rows="3"
              required
            ></textarea>
            <div className="comment-form-actions">
              <button type="submit" className="btn-post-comment" disabled={submittingComment}>
                {submittingComment ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>
        ) : (
          <div className="login-prompt">
            <p>
              Please <Link to="/login">login</Link> to write a comment and join the discussion.
            </p>
          </div>
        )}

        {/* Comments Feed List */}
        <div className="comments-list">
          {comments.length > 0 ? (
            comments.map((comment) => {
              const commentDate = new Date(comment.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              });
              
              // Validate ownership: check if comment belongs to logged-in user
              const isOwner = user && comment.user && (comment.user._id === user.id || comment.user === user.id);

              return (
                <div key={comment._id} className="comment-item">
                  <div className="comment-header">
                    <div className="comment-user">
                      <div className="comment-avatar">
                        {comment.user?.name ? comment.user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <span className="comment-author-name">{comment.user?.name || 'Anonymous'}</span>
                        <span className="comment-date">{commentDate}</span>
                      </div>
                    </div>
                    {isOwner && (
                      <button 
                        onClick={() => handleCommentDelete(comment._id)} 
                        className="btn-delete-comment" 
                        aria-label="Delete comment"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                      </button>
                    )}
                  </div>
                  <div className="comment-body">
                    <p>{comment.text}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="no-comments">No comments yet. Start the conversation!</p>
          )}
        </div>
      </section>
    </article>
  );
}
