import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BlogCard from '../components/BlogCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import '../css/Blogs.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Blogs() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  // List of restricted categories matching the backend enums
  const categories = ['All', 'Technology', 'Programming', 'Web Development', 'Database', 'Career', 'General'];

  const fetchPosts = async (page = 1) => {
    try {
      setLoading(true);
      setError('');
      
      let url = `${API_URL}/api/posts?page=${page}&limit=6`;
      let isPaginated = true;

      if (searchQuery.trim()) {
        url = `${API_URL}/api/posts/search?q=${encodeURIComponent(searchQuery)}`;
        isPaginated = false;
      } else if (selectedCategory !== 'All') {
        url = `${API_URL}/api/posts/category/${encodeURIComponent(selectedCategory)}`;
        isPaginated = false;
      }

      const response = await axios.get(url);

      if (isPaginated) {
        setPosts(response.data.posts || []);
        setCurrentPage(response.data.page || 1);
        setTotalPages(response.data.totalPages || 1);
        setTotalPosts(response.data.totalPosts || 0);
      } else {
        setPosts(response.data || []);
        setCurrentPage(1);
        setTotalPages(1);
        setTotalPosts(response.data.length || 0);
      }
    } catch (err) {
      setError('Failed to fetch posts. Please check your backend connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Effect to handle live search with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPosts(1);
    }, searchQuery.trim() ? 300 : 0);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, selectedCategory]);

  const handleCategoryChange = (e) => {
    const cat = e.target.value;
    setSelectedCategory(cat);
    setSearchQuery(''); // Clear search query when filtering by category
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    if (val.trim() && selectedCategory !== 'All') {
      setSelectedCategory('All');
    }
    setSearchQuery(val);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchPosts(newPage);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPosts(1);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
          disabled={loading}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <div className="blogs-page container">
      {/* Page Header */}
      <header className="blogs-header">
        <h1 className="blogs-title">Explore Articles</h1>
        <p className="blogs-subtitle">Browse through our database of development articles, guides, and tutorials.</p>
      </header>

      {/* Filters & Search Row */}
      <section className="search-filter-section">
        <form onSubmit={handleSearchSubmit} className="search-filter-form">
          {/* Search Input */}
          <div className="search-bar-container">
            <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input 
              type="text" 
              placeholder="Search blogs by title, summary, or content..." 
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
              disabled={loading}
            />
            {searchQuery && (
              <button type="button" className="clear-search-btn" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}>
                &times;
              </button>
            )}
          </div>

          {/* Controls Wrapper for dropdown & button */}
          <div className="filter-controls-group">
            {/* Category Dropdown */}
            <div className="category-dropdown-container">
              <select 
                value={selectedCategory} 
                onChange={handleCategoryChange} 
                className="category-select"
                disabled={loading}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'All' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Action Button */}
            <button type="submit" className="search-action-btn" disabled={loading}>
              Search
            </button>
          </div>
        </form>
      </section>

      {/* Blogs Grid */}
      <section className="blogs-grid-container">
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="blogs-error-state">
            <ErrorMessage message={error} />
            <button className="reset-btn" onClick={() => fetchPosts(currentPage)}>Retry Connection</button>
          </div>
        ) : posts.length > 0 ? (
          <>
            <div className="blogs-grid">
              {posts.map((post, index) => {
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
                    gradientIndex={index}
                  />
                );
              })}
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pagination-container">
                <button 
                  className="pagination-btn" 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || loading}
                >
                  Previous
                </button>
                {renderPaginationButtons()}
                <button 
                  className="pagination-btn" 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || loading}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="empty-icon"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>
            <h3>No Articles Found</h3>
            <p>We couldn't find any articles matching your search criteria. Try clearing query filters or searching other keywords.</p>
            <button className="reset-btn" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}>
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
