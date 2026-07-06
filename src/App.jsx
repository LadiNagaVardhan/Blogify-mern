import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Blogs from './pages/Blogs';
import About from './pages/About';
import Login from './pages/Login';
import CreatePost from './pages/CreatePost';
import MyPosts from './pages/MyPosts';
import EditPost from './pages/EditPost';
import PostDetails from './pages/PostDetails';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import { FeedbackProvider, useFeedback } from './context/FeedbackContext';

function AppContent() {
  const navigate = useNavigate();
  const { showConfirm, showToast } = useFeedback();

  // Check localStorage for active session token on initialization
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch {
      return null;
    }
  });

  // Logout handler using custom Confirm Modal
  const handleLogout = () => {
    showConfirm('Confirm Logout', 'Are you sure you want to log out from Blogify?', () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsLoggedIn(false);
      setUser(null);
      showToast('Logged out successfully.', 'success');
      navigate('/login');
    });
  };

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
      <main style={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          
          {/* Protected routes: redirect to login if not authenticated */}
          <Route path="/create-post" element={isLoggedIn ? <CreatePost /> : <Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
          <Route path="/my-posts" element={isLoggedIn ? <MyPosts /> : <Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
          <Route path="/edit-post/:id" element={isLoggedIn ? <EditPost /> : <Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
          <Route path="/profile" element={isLoggedIn ? <Profile user={user} setUser={setUser} /> : <Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
          <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
          
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <FeedbackProvider>
      <Router>
        <AppContent />
      </Router>
    </FeedbackProvider>
  );
}

export default App;
