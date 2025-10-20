import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Navbar.css';

function Navbar() {
  const { currentUser, loginWithGoogle, logout } = useAuth();
  const location = useLocation();

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
      toast.success('Successfully logged in!');
    } catch (error) {
      console.error("Failed to log in", error);
      toast.error('Failed to log in.');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Successfully logged out!');
    } catch (error) {
      console.error("Failed to log out", error);
      toast.error('Failed to log out.');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/store">VoltCart</Link>
      </div>
      <div className="navbar-auth">
        {currentUser ? (
          <div className="user-info">
            <span>Welcome, {currentUser.displayName}</span>
            {location.pathname.startsWith('/dashboard') ? (
              <Link to="/store" className="auth-button">Store</Link>
            ) : (
              <Link to="/dashboard" className="auth-button">My Dashboard</Link>
            )}
            <button onClick={handleLogout} className="auth-button">Logout</button>
          </div>
        ) : (
          <button onClick={handleLogin} className="auth-button">Login with Google</button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;