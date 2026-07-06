import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BlogCard from '../components/BlogCard';
import LoadingSpinner from '../components/LoadingSpinner';
import '../css/Home.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Home() {
  const navigate = useNavigate();
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch recent posts on mount
  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/posts/recent`);
        setRecentPosts(response.data);
      } catch (err) {
        console.error('Failed to fetch recent posts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  const featuredBlogs = [
    {
      id: 'featured-1',
      title: 'Getting Started with MERN Stack',
      author: 'John Doe',
      description: 'Learn the fundamentals of MongoDB, Express, React and Node.js.',
      category: 'General',
      date: 'May 15, 2026',
      readTime: '8 min read',
    },
    {
      id: 'featured-2',
      title: 'React Best Practices',
      author: 'Sarah Wilson',
      description: 'Discover techniques to build scalable and maintainable React applications.',
      category: 'Programming',
      date: 'June 02, 2026',
      readTime: '6 min read',
    },
    {
      id: 'featured-3',
      title: 'Understanding JavaScript ES6',
      author: 'Michael Smith',
      description: 'Explore modern JavaScript features that every developer should know.',
      category: 'Programming',
      date: 'June 18, 2026',
      readTime: '5 min read',
    },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container container">
          <div className="hero-content">
            <span className="hero-badge">Welcome to Blogify</span>
            <h1 className="hero-heading">Share Your Ideas With The World</h1>
            <p className="hero-description">
              Create, publish and explore meaningful articles through a modern blogging experience.
            </p>
            <button className="hero-btn" onClick={() => navigate('/blogs')}>
              Read Blogs
            </button>
          </div>
        </div>
        {/* Subtle decorative background shapes */}
        <div className="decor-circle decor-1"></div>
        <div className="decor-circle decor-2"></div>
      </section>

      {/* Featured Section */}
      <section className="featured-section">
        <div className="featured-container container">
          <div className="section-header">
            <h2 className="section-title">Featured Articles</h2>
            <div className="section-title-line"></div>
          </div>
          
          <div className="featured-grid">
            {featuredBlogs.map((blog, index) => (
              <BlogCard 
                key={blog.id}
                title={blog.title}
                description={blog.description}
                author={blog.author}
                category={blog.category}
                date={blog.date}
                readTime={blog.readTime}
                gradientIndex={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Recent Posts Section */}
      <section className="recent-posts-section">
        <div className="recent-container container">
          <div className="section-header">
            <h2 className="section-title">Recent Articles</h2>
            <div className="section-title-line"></div>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : recentPosts.length > 0 ? (
            <div className="recent-grid">
              {recentPosts.map((post, index) => {
                const formattedDate = new Date(post.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                });
                const wordsCount = post.content ? post.content.split(/\s+/).length : 0;
                const readTimeVal = Math.max(1, Math.round(wordsCount / 200)) + ' min read';

                return (
                  <BlogCard
                    key={post._id}
                    id={post._id}
                    title={post.title}
                    description={post.summary}
                    author={post.author?.name || 'Anonymous'}
                    category={post.category}
                    date={formattedDate}
                    readTime={readTimeVal}
                    gradientIndex={index + 3} // Offset gradients
                  />
                );
              })}
            </div>
          ) : (
            <div className="home-empty">
              <p>No recent articles found. Be the first to publish a post!</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to action section for students UI look */}
      <section className="highlights-section">
        <div className="highlights-container container">
          <div className="highlights-card">
            <h3>Learn, Write & Connect</h3>
            <p>Ready to start writing your own articles? Join our student developer platform today.</p>
            <div className="highlights-buttons">
              <button className="btn-primary" onClick={() => navigate('/login')}>Get Started</button>
              <button className="btn-secondary" onClick={() => navigate('/about')}>Learn More</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
