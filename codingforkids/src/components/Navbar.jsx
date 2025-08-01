import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { UserContext } from '../context/UserContext';
import logo from '../assets/logo.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Navbar = () => {
  const { user, setUser } = useContext(UserContext);

  // Add scroll animation effect
  useEffect(() => {
    const navbar = document.querySelector('.navbar');
    const handleScroll = () => {
      if (window.scrollY > 10) {
        navbar.classList.add('navbar-scrolled');
      } else {
        navbar.classList.remove('navbar-scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLoginSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    setUser({
      name: decoded.name,
      email: decoded.email,
      picture: decoded.picture
    });
    localStorage.setItem('userEmail', decoded.email);
  };
    const isAdmin =
    user?.email === 'hemraj.221506@ncit.edu.np' ||
    user?.email === 'nepal.codingforkids@gmail.com';

  const navigate = useNavigate();

  const handleLogout = async () => {
    const email = localStorage.getItem('userEmail');
    await axios.post('https://codingforkidsnepal.com/api/logout', { email });
    localStorage.clear();
    setUser(null);
    localStorage.removeItem('user');
    navigate('/home');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top animate__animated animate__fadeInDown">
      <div className="container">
        {/* Brand Logo with Animation */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src={logo}
            alt="Coding for Kids Logo"
            width="80"
            height="60"
            className="d-inline-block align-top me-2 animate__animated animate__pulse animate__infinite animate__slower"
          />
        
        </Link>

        {/* Animated Mobile Toggle Button */}
        <button
          className="navbar-toggler animate__animated animate__pulse animate__infinite animate__slower"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Content */}
        <div className="collapse navbar-collapse" id="mainNavbar">
          {/* Navigation Links with Hover Animation */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link 
                className="nav-link px-3 py-2 mx-1 rounded-3 animate__animated animate__fadeIn animate__delay-1s" 
                to="/"
              >
                <i className="bi bi-house-door me-1"></i> 
                <span className="nav-link-text">Home</span>
                <span className="nav-link-underline"></span>
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className="nav-link px-3 py-2 mx-1 rounded-3 animate__animated animate__fadeIn animate__delay-2s" 
                to="/yourcourse"
              >
                <i className="bi bi-book me-1"></i> 
                <span className="nav-link-text">Your Courses</span>
                <span className="nav-link-underline"></span>
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className="nav-link px-3 py-2 mx-1 rounded-3 animate__animated animate__fadeIn animate__delay-3s" 
                to="/programmes"
              >
                <i className="bi bi-laptop me-1"></i> 
                <span className="nav-link-text">Programmes</span>
                <span className="nav-link-underline"></span>
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className="nav-link px-3 py-2 mx-1 rounded-3 animate__animated animate__fadeIn animate__delay-4s" 
                to="/about"
              >
                <i className="bi bi-info-circle me-1"></i> 
                <span className="nav-link-text">About</span>
                <span className="nav-link-underline"></span>
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className="nav-link px-3 py-2 mx-1 rounded-3 animate__animated animate__fadeIn animate__delay-5s" 
                to="/contact"
              >
                <i className="bi bi-envelope me-1"></i> 
                <span className="nav-link-text">Contact</span>
                <span className="nav-link-underline"></span>
              </Link>
            </li>
            {isAdmin && (
              <li className="nav-item">
                <Link className="nav-link px-3 py-2 mx-1 rounded-3 animate__animated animate__fadeIn animate__delay-5s" to="admin/Dashboard"> <span className="nav-link-text">Admin Dashboard</span>
                <span className="nav-link-underline"></span>
                </Link>
              </li>
            )}

          </ul>

          {/* User Authentication Section with Animation */}
          <div className="d-flex align-items-center ms-lg-3 animate__animated animate__fadeIn animate__delay-6s">
            {!user ? (
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={() => console.log('Login Failed')}
                theme="filled_blue"
                size="medium"
                shape="pill"
                text="signin_with"
                className="google-login-btn"
              />
            ) : (
              <div className="dropdown">
                <button
                  className="btn btn-gradient dropdown-toggle d-flex align-items-center user-profile-btn"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src={user.picture}
                    alt="Profile"
                    className="rounded-circle me-2 profile-img"
                    width="36"
                    height="36"
                  />
                  <span className="d-none d-sm-inline user-name">{user.name}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-lg" aria-labelledby="userDropdown">
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      <i className="bi bi-person me-2"></i> Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/settings">
                      <i className="bi bi-gear me-2"></i> Settings
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i> Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;