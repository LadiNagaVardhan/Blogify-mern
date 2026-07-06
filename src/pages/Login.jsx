import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useFeedback } from '../context/FeedbackContext';
import '../css/Login.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Login({ setIsLoggedIn, setUser }) {
  const { showToast } = useFeedback();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic frontend validations
    if (!email || !password) {
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
      
      // POST request to backend API
      const response = await axios.post(`${API_URL}/api/users/login`, {
        email,
        password,
      });

      setSuccess('Login successful! Redirecting...');
      showToast('Login successful!', 'success');
      
      // Save JWT token in localStorage under key 'token'
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Update global logged in state
      setIsLoggedIn(true);
      if (setUser) {
        setUser(response.data.user);
      }

      // Clear inputs
      setEmail('');
      setPassword('');

      // Redirect to home page after a brief delay for visual feedback
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      // Extract error message from backend response if available
      const errMsg = err.response?.data?.message || 'Login failed. Please try again later.';
      setError(errMsg);
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container container">
        <div className="login-card">
          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Login to manage your posts and settings</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
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

            {/* Mock Forgot Password */}
            <div className="forgot-password">
              <span onClick={() => showToast('Forgot Password system is currently under development.', 'error')}>
                Forgot password?
              </span>
            </div>

            {/* Submit Button */}
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Registration Link */}
          <div className="login-footer">
            <p>
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </div>
        </div>
      </div>
      {/* Background shapes */}
      <div className="login-decor login-decor-1"></div>
      <div className="login-decor login-decor-2"></div>
    </div>
  );
}
