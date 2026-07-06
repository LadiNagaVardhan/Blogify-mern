import React from 'react';
import '../css/About.css';

export default function About() {
  return (
    <div className="about-page container">
      {/* Header Section */}
      <header className="about-header">
        <span className="about-tag">Our Platform</span>
        <h1 className="about-title">About Blogify</h1>
        <div className="about-title-line"></div>
      </header>

      {/* Main Content Info */}
      <section className="about-content-section">
        <div className="about-card">
          <div className="about-info-text">
            <p className="lead-text">
              Blogify is a modern blogging platform where users can share ideas, publish articles and explore knowledge through an easy-to-use interface.
            </p>
            <p>
              Whether you are a professional software engineer, a college student starting your development journey, or someone passionate about sharing tech knowledge, Blogify provides you with a clean, fast, and distraction-free writing environment.
            </p>
            <p>
              Designed for modern web enthusiasts, our mission is to simplify how thoughts are curated, designed, and spread across the digital workspace.
            </p>
          </div>
          
          {/* Side stats card */}
          <div className="about-stats">
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Open Source</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">Pure CSS</span>
              <span className="stat-label">No Frameworks</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">Lightning</span>
              <span className="stat-label">Fast Performance</span>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <h2 className="section-subtitle">Why Choose Blogify?</h2>
        
        <div className="values-grid">
          <div className="value-card">
            <div className="value-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
            </div>
            <h3>Share Ideas</h3>
            <p>Express yourself through rich text formats. Write articles about software, design, tutorials, or life experiences.</p>
          </div>

          <div className="value-card">
            <div className="value-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
            </div>
            <h3>Gain Knowledge</h3>
            <p>Explore high-quality articles written by student developers, senior engineers, and technology professionals worldwide.</p>
          </div>

          <div className="value-card">
            <div className="value-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            </div>
            <h3>Join a Community</h3>
            <p>Connect with a passionate group of creators who value learning, constructive reviews, and technical advancement.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
