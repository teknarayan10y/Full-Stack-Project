import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import googleIcon from '../assets/icons/google.svg';
import facebookIcon from '../assets/icons/facebook.svg';
import linkedinIcon from '../assets/icons/linkedin.svg';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name) return 'Name is required';
    if (!formData.email) return 'Email is required';
    if (!formData.email.includes('@')) return 'Invalid email format';
    if (!formData.password) return 'Password is required';
    if (formData.password.length < 6) return 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
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
      const { confirmPassword, ...registerData } = formData;
      const response = await register(registerData);
      if (response.user) {
        // Navigate to home page after successful registration
        navigate('/');
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
      console.error('Registration error:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    setIsLoading(true);
    // Implement social login logic here
    console.log(`Signing up with ${provider}`);
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
          <h1 className="auth-title">Create Account</h1>
        </div>

        <div className="social-login">
          <p className="social-login-text">Sign up with</p>
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
            <label className="form-label" htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-input red-text-input"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>

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
              placeholder="Enter your email"
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
              placeholder="Enter your password"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="form-input red-text-input"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
            />
          </div>

          <button
            type="submit"
            className={`submit-btn ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-link">
          Already have an account?{' '}
          <span onClick={() => navigate('/login')} style={{ cursor: 'pointer', color: '#0396FF' }}>
            Sign In
          </span>
        </div>
      </div>
    </div>
  );
};

export default Register;
