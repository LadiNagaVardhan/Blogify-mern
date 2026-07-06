import React from 'react';
import { Link } from 'react-router-dom';
import { useFeedback } from '../context/FeedbackContext';
import '../css/Footer.css';

export default function Footer() {
  const { showToast } = useFeedback();
  const currentYear = new Date().getFullYear();

  const handleSubscribe = (e) => {
    e.preventDefault();
    showToast('Thank you for subscribing! Newsletter functionality is coming soon.', 'success');
  };

  return (
    <footer className="footer">
      <div className="footer-container container">
        <div className="footer-grid">
          {/* Brand & About Column */}
          <div className="footer-col brand-col">
            <h3 className="footer-logo">BLOGIFY</h3>
            <p className="footer-about-text">
              Blogify helps users create and explore blogs easily. Share your stories, lessons, and thoughts with our global community.
            </p>
          </div>

          {/* Sitemap Links Column */}
          <div className="footer-col links-col">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/blogs">Blogs</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/login">Login</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="footer-col contact-col">
            <h4>Contact Info</h4>
            <p className="contact-email">
              Email: <a href="mailto:contact@blogify.com">contact@blogify.com</a>
            </p>
            {/* Social Icons */}
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            </div>
          </div>

          {/* Newsletter Column */}
          <div className="footer-col newsletter-col">
            <h4>Newsletter</h4>
            <p>Get notified when new articles are published.</p>
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="newsletter-input" 
                required 
              />
              <button type="submit" className="newsletter-btn">Subscribe</button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>&copy; {currentYear} BLOGIFY. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
