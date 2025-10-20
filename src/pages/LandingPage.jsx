import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  return (
    <div className="landing-container">
      <div className="landing-box">
        <h1>Welcome to VoltCart</h1>
        <p>Please select your role to continue</p>
        <div className="role-selection">
          <Link to="/store" className="role-button user">
            Enter as User
          </Link>
          <Link to="/admin" className="role-button admin">
            Enter as Admin
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;