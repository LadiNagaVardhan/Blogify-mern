import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useFeedback } from '../context/FeedbackContext';
import '../css/Profile.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Profile({ user, setUser }) {
  const { showToast } = useFeedback();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [email, setEmail] = useState('');
  const [joinedDate, setJoinedDate] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await axios.get(`${API_URL}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userData = response.data;
        setName(userData.name || '');
        setBio(userData.bio || '');
        setAvatar(userData.avatar || '');
        setEmail(userData.email || '');
        setJoinedDate(new Date(userData.createdAt).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }));
      } catch (err) {
        setError('Failed to fetch user profile details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('Name cannot be empty.');
      return;
    }

    try {
      setSaving(true);
      const response = await axios.put(
        `${API_URL}/api/users/profile`,
        { name, bio, avatar },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess('Profile updated successfully!');
      showToast('Profile updated successfully!', 'success');
      
      // Update local storage user details
      const updatedUser = response.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Trigger navbar/app update
      if (setUser) {
        setUser(updatedUser);
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to update profile. Please try again.';
      setError(errMsg);
      showToast(errMsg, 'error');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="profile-page container">
      <div className="profile-wrapper">
        {/* Profile Card Summary */}
        <div className="profile-card-sidebar">
          <div className="avatar-preview-container">
            {avatar ? (
              <img src={avatar} alt={name} className="profile-avatar-large" onError={(e) => { e.target.style.display = 'none'; }} />
            ) : (
              <div className="profile-avatar-fallback-large">
                {name ? name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
          </div>
          <h2 className="profile-card-name">{name}</h2>
          <p className="profile-card-email">{email}</p>
          <div className="profile-card-divider"></div>
          <p className="profile-card-bio-text">{bio || 'No bio written yet. Edit your details to tell people about yourself!'}</p>
          <div className="profile-card-meta">
            <span className="meta-label">Joined</span>
            <span className="meta-value">{joinedDate}</span>
          </div>
        </div>

        {/* Profile Edit Form */}
        <div className="profile-form-container">
          <div className="profile-form-header">
            <h3>Account Settings</h3>
            <p>Update your public profile display name, biography description, and profile picture avatar URL.</p>
          </div>

          <form onSubmit={handleSubmit} className="profile-form">
            {error && <ErrorMessage message={error} />}
            {success && (
              <div className="form-alert success-alert">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>{success}</span>
              </div>
            )}

            {/* Email (Readonly) */}
            <div className="profile-form-group">
              <label htmlFor="profile-email">Email Address</label>
              <input
                id="profile-email"
                type="email"
                value={email}
                disabled
                className="input-readonly"
              />
              <small className="help-text">Email address is linked to login credentials and cannot be modified.</small>
            </div>

            {/* Name */}
            <div className="profile-form-group">
              <label htmlFor="profile-name">Full Name *</label>
              <input
                id="profile-name"
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={saving}
                required
              />
            </div>

            {/* Avatar URL */}
            <div className="profile-form-group">
              <label htmlFor="profile-avatar">Avatar Image URL</label>
              <input
                id="profile-avatar"
                type="url"
                placeholder="https://images.unsplash.com/photo-..."
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                disabled={saving}
              />
              <small className="help-text">Provide an absolute URL pointing to a publicly accessible image file.</small>
            </div>

            {/* Bio */}
            <div className="profile-form-group">
              <label htmlFor="profile-bio">Biography</label>
              <textarea
                id="profile-bio"
                rows="4"
                placeholder="Tell us a little bit about yourself, your skills, interests..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                disabled={saving}
              ></textarea>
            </div>

            {/* Actions */}
            <div className="profile-form-actions">
              <button
                type="submit"
                className="profile-save-btn"
                disabled={saving}
              >
                {saving ? 'Saving changes...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
