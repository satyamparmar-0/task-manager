import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/navbar.modules.css'; // Import the CSS file

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-icon">
        {/* <img src="/path-to-icon.png" alt="Icon" className="navbar-logo" /> */}
      </div>
      <div className="navbar-links">
        <Link to="/login" className="nav-button">Login</Link>
        <Link to="/signup" className="nav-button signup-btn">Signup</Link>
      </div>
    </nav>
  );
}

export default Navbar;
