import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/BlogCard.css';

export default function BlogCard({ id, title, description, author, category, date, readTime, gradientIndex }) {
  const navigate = useNavigate();

  // Array of premium gradients to use as header images
  const gradients = [
    'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', // Indigo to Purple
    'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)', // Blue to Cyan
    'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)', // Emerald to Blue
    'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)', // Amber to Red
    'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)', // Pink to Violet
    'linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)', // Teal to Deep Teal
  ];

  const cardGradient = gradients[gradientIndex % gradients.length] || gradients[0];

  const handleReadMore = () => {
    if (id) {
      navigate(`/posts/${id}`);
    } else {
      navigate('/blogs');
    }
  };

  return (
    <div className="blog-card">
      {/* Blog Card Image (Self-contained Gradient design) */}
      <div className="blog-card-image" style={{ background: cardGradient }}>
        <div className="blog-card-badge">{category || 'Articles'}</div>
        <div className="blog-card-overlay-text">BLOGIFY</div>
      </div>

      <div className="blog-card-content">
        {/* Meta Info */}
        <div className="blog-card-meta">
          <span>{date || 'June 24, 2026'}</span>
          <span className="meta-dot"></span>
          <span>{readTime || '5 min read'}</span>
        </div>

        {/* Title */}
        <h3 className="blog-card-title">{title}</h3>

        {/* Description */}
        <p className="blog-card-description">{description}</p>

        {/* Card Footer: Author & Read More Button */}
        <div className="blog-card-footer">
          <div className="blog-card-author">
            <div className="author-avatar">
              {author ? author.charAt(0) : 'U'}
            </div>
            <span className="author-name">{author || 'Admin'}</span>
          </div>
          
          <button onClick={handleReadMore} className="read-more-btn" aria-label={`Read more about ${title}`}>
            Read More
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
