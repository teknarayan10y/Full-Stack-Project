import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = await authService.getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      if (response.token && response.user) {
        localStorage.setItem('token', response.token);
        setUser(response.user);
        setIsAuthenticated(true);
        return response;
      }
      throw new Error('Invalid registration response');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      if (response.data?.token && response.data?.user) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        setIsAuthenticated(true);
        return response.data;
      }
      throw new Error('Invalid login response');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Get user profile
  const getUserProfile = async () => {
    try {
      const response = await authService.getProfile();
      return response.user;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (profileData) => {
    try {
      const response = await authService.updateProfile(profileData);
      if (response.success && response.user) {
        setUser(response.user);
        return response.user;
      }
      throw new Error('Invalid update profile response');
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  // Update user preferences
  const updatePreferences = async (preferences) => {
    try {
      const response = await authService.updatePreferences(preferences);
      if (response.success) {
        setUser(prev => ({
          ...prev,
          preferences: response.preferences
        }));
        return response.preferences;
      }
      throw new Error('Invalid update preferences response');
    } catch (error) {
      console.error('Update preferences error:', error);
      throw error;
    }
  };

  // Change password
  const changePassword = async (passwordData) => {
    try {
      const response = await authService.changePassword(passwordData);
      return response;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      register,
      login,
      logout,
      getUserProfile,
      updateUserProfile,
      updatePreferences,
      changePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
