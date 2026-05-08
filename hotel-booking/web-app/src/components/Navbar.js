import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaHome, FaHotel, FaBookmark, FaUserShield, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import './Navbar.css';

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  console.log('Navbar - Current auth state:', { isAuthenticated, user });

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleBookingClick = (e) => {
    e.preventDefault();
    closeMenu();
    console.log('Booking click - Auth state:', { isAuthenticated, user });
    
    if (!isAuthenticated) {
      console.log('Not authenticated, redirecting to login');
      navigate('/login');
    } else {
      console.log('Authenticated, going to bookings');
      navigate('/bookings');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" onClick={closeMenu}>HotelBooking</Link>
      </div>
      <button className="mobile-menu-btn" onClick={toggleMenu}>
        <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </button>
      <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
        <Link to="/" className={`nav-link icon-nav-link ${isActive('/')}`} onClick={closeMenu}>
          <FaHome className="nav-icon" />
          <span>Home</span>
        </Link>
        <Link to="/hotels" className={`nav-link icon-nav-link ${isActive('/hotels')}`} onClick={closeMenu}>
          <FaHotel className="nav-icon" />
          <span>Hotels</span>
        </Link>
        {isAuthenticated ? (
          <Link to="/bookings" className={`nav-link icon-nav-link ${isActive('/bookings')}`}>
            <FaBookmark className="nav-icon" />
            <span>Bookings</span>
          </Link>
        ) : (
          <button className="nav-link icon-nav-link" onClick={handleBookingClick}>
            <FaBookmark className="nav-icon" />
            <span>Bookings</span>
          </button>
        )}
        {isAuthenticated && user?.role === 'instructor' && (
          <Link to="/admin" className={`nav-link icon-nav-link admin-link ${isActive('/admin')}`} onClick={closeMenu}>
            <FaUserShield className="nav-icon" />
            <span>Instructor Dashboard</span>
          </Link>
        )}
        {isAuthenticated && (
          <Link to="/profile" className={`nav-link profile-nav-link ${isActive('/profile')}`} onClick={closeMenu}>
            {user?.profilePicture ? (
              <div className="nav-profile-picture">
                <img 
                  src={user.profilePicture.startsWith('http') ? user.profilePicture : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${user.profilePicture}`} 
                  alt="Profile" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff&size=32`;
                  }}
                />
              </div>
            ) : (
              <div className="nav-profile-initial">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
          </Link>
        )}
        {isAuthenticated ? (
          <button onClick={() => { logout(); closeMenu(); }} className="nav-link icon-nav-link logout-btn">
            <FaSignOutAlt className="nav-icon" />
            <span>Logout</span>
          </button>
        ) : (
          <Link to="/login" className={`nav-link icon-nav-link ${isActive('/login')}`} onClick={closeMenu}>
            <FaSignInAlt className="nav-icon" />
            <span>Login</span>
          </Link>
        )}

        
      </div>
    </nav>
  );
}

export default Navbar;
