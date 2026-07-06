import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useFeedback } from '../context/FeedbackContext';
import '../css/Register.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Register() {
  const { showToast } = useFeedback();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic frontend validations
    if (!name.trim() || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      
      await axios.post(`${API_URL}/api/users/register`, {
        name,
        email,
        password,
      });

      setSuccess('Account created successfully! Redirecting to login page...');
      showToast('Registration successful!', 'success');
      
      // Clear inputs
      setName('');
      setEmail('');
      setPassword('');

      // Redirect to login page after a brief delay
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Registration failed. Please try again later.';
      setError(errMsg);
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container container">
        <div className="register-card">
          <div className="register-header">
            <h2>Create Account</h2>
            <p>Sign up to start sharing your stories on Blogify</p>
          </div>

          <form onSubmit={handleRegister} className="register-form">
            {/* Error Alert */}
            {error && (
              <div className="alert-message error-alert">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                <span>{error}</span>
              </div>
            )}

            {/* Success Alert */}
            {success && (
              <div className="alert-message success-alert">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>{success}</span>
              </div>
            )}

            {/* Name Input */}
            <div className="input-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            {/* Email Input */}
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="developer@blogify.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            {/* Password Input */}
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            {/* Submit Button */}
            <button type="submit" className="register-btn" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          {/* Link to Login */}
          <div className="register-footer">
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
      {/* Background shapes */}
      <div className="register-decor register-decor-1"></div>
      <div className="register-decor register-decor-2"></div>
    </div>
  );
}
