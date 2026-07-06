import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import '../css/Navbar.css';

export default function Navbar({ isLoggedIn, user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add scroll listener to make navbar background slightly less transparent on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const getAvatarContent = () => {
    if (user && user.avatar) {
      return <img src={user.avatar} alt={user.name} className="navbar-avatar-img" />;
    }
    const initial = user && user.name ? user.name.charAt(0).toUpperCase() : 'U';
    return <span className="navbar-avatar-fallback">{initial}</span>;
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container container">
        <NavLink to="/" className="navbar-logo" onClick={closeMenu}>
          BLOGIFY
        </NavLink>

        {/* Hamburger Menu Icon for Mobile */}
        <button className={`menu-toggle ${isOpen ? 'open' : ''}`} onClick={toggleMenu} aria-label="Toggle Navigation Menu">
          <span className="hamburger-bar"></span>
          <span className="hamburger-bar"></span>
          <span className="hamburger-bar"></span>
        </button>

        {/* Navigation Links */}
        <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <NavLink 
              to="/" 
              className={({ isActive }) => `nav-links ${isActive ? 'active-link' : ''}`}
              onClick={closeMenu}
            >
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink 
              to="/blogs" 
              className={({ isActive }) => `nav-links ${isActive ? 'active-link' : ''}`}
              onClick={closeMenu}
            >
              Blogs
            </NavLink>
          </li>
          
          {/* Conditional routes based on Auth status */}
          {isLoggedIn ? (
            <>
              <li className="nav-item">
                <NavLink 
                  to="/create-post" 
                  className={({ isActive }) => `nav-links ${isActive ? 'active-link' : ''}`}
                  onClick={closeMenu}
                >
                  Create Post
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink 
                  to="/my-posts" 
                  className={({ isActive }) => `nav-links ${isActive ? 'active-link' : ''}`}
                  onClick={closeMenu}
                >
                  My Posts
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink 
                  to="/dashboard" 
                  className={({ isActive }) => `nav-links ${isActive ? 'active-link' : ''}`}
                  onClick={closeMenu}
                >
                  Dashboard
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink 
                  to="/profile" 
                  className={({ isActive }) => `nav-links profile-link ${isActive ? 'active-link' : ''}`}
                  onClick={closeMenu}
                >
                  <div className="navbar-avatar-container">
                    {getAvatarContent()}
                  </div>
                  <span>Profile</span>
                </NavLink>
              </li>
              <li className="nav-item nav-btn">
                <button 
                  onClick={() => { closeMenu(); onLogout(); }} 
                  className="nav-links-btn logout-btn"
                  style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit', width: '100%' }}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <NavLink 
                  to="/about" 
                  className={({ isActive }) => `nav-links ${isActive ? 'active-link' : ''}`}
                  onClick={closeMenu}
                >
                  About
                </NavLink>
              </li>
              <li className="nav-item nav-btn">
                <NavLink 
                  to="/login" 
                  className={({ isActive }) => `nav-links-btn ${isActive ? 'active-btn' : ''}`}
                  onClick={closeMenu}
                >
                  Login
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
      {/* Overlay to close menu when clicking outside on mobile */}
      {isOpen && <div className="nav-overlay" onClick={closeMenu}></div>}
    </nav>
  );
}
