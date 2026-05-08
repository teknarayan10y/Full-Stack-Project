import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/api';
import './Auth.css';
import googleIcon from '../assets/icons/google.svg';
import facebookIcon from '../assets/icons/facebook.svg';
import linkedinIcon from '../assets/icons/linkedin.svg';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const { login } = useAuth();

  const validateForm = () => {
    if (!formData.email) return 'Email is required';
    if (!formData.email.includes('@')) return 'Invalid email format';
    if (!formData.password) return 'Password is required';
    if (formData.password.length < 6) return 'Password must be at least 6 characters';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      return;
    }
    
    try {
      console.log('Attempting login with:', formData);
      const response = await login(formData);
      console.log('Login response:', response);
      
      if (response.token && response.user) {
        console.log('Login successful, user:', response.user);
        // Wait a moment for the auth state to update
        await new Promise(resolve => setTimeout(resolve, 100));
        navigate('/');
      } else {
        console.error('Invalid login response:', response);
        setError('Invalid login response');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      console.error('Login error:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await authService.socialLogin(provider);
      if (response.user) {
        navigate(response.user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
      } else {
        setError('Invalid social login response');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || `${provider} login failed`);
    } finally {
      setIsLoading(false);
    }
  };

  // Create floating particles
  const particles = Array(10).fill(null).map((_, index) => ({
    id: index,
    style: {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 20}s`,
      animationDuration: `${15 + Math.random() * 10}s`
    }
  }));

  return (
    <div className="auth-page">
      <div className="particles">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="particle"
            style={particle.style}
          />
        ))}
      </div>
      
      <div className="auth-container">
        <div className="auth-header">
          <h1 className="auth-title">Welcome Back</h1>
        </div>

        <div className="social-login">
          <p className="social-login-text">Continue with</p>
          <div className="social-buttons">
            <button 
              className="social-btn google"
              onClick={() => handleSocialLogin('google')}
            >
              <div className="icon-wrapper">
                <img src={googleIcon} alt="Google" />
              </div>
              <span>Google</span>
            </button>
            <button 
              className="social-btn facebook"
              onClick={() => handleSocialLogin('facebook')}
            >
              <div className="icon-wrapper">
                <img src={facebookIcon} alt="Facebook" />
              </div>
              <span>Facebook</span>
            </button>
            <button 
              className="social-btn linkedin"
              onClick={() => handleSocialLogin('linkedin')}
            >
              <div className="icon-wrapper">
                <img src={linkedinIcon} alt="LinkedIn" />
              </div>
              <span>LinkedIn</span>
            </button>
          </div>
        </div>

        <div className="divider">
          <span>or</span>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input red-text-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input red-text-input"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className={`submit-btn ${isLoading ? 'loading-btn' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-link">
          Don't have an account?
          <Link to="/register">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
