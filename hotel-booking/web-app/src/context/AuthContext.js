import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth context...');
        const currentUser = await authService.getCurrentUser();
        console.log('Initial auth state:', { user: currentUser });
        setUser(currentUser);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
    
    // Listen for storage events to sync auth state across tabs
    const handleStorageChange = async (e) => {
      console.log('Storage changed:', e.key);
      if (e.key === 'user' || e.key === 'token') {
        try {
          const currentUser = await authService.getCurrentUser();
          console.log('Storage event - New auth state:', { user: currentUser });
          setUser(currentUser);
        } catch (error) {
          console.error('Error handling storage event:', error);
          setUser(null);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const data = await authService.login(credentials);
      console.log('Login response in context:', data);
      
      // Verify authentication after login
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        console.log('Setting verified user in context:', currentUser);
        setUser(currentUser);
      } else {
        console.error('Failed to verify user after login');
        throw new Error('Authentication failed');
      }
      
      return data;
    } catch (error) {
      console.error('Login error in context:', error);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      setUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.clearAuth();
    setUser(null);
    console.log('User logged out');
  };

  const updateProfile = async (userData) => {
    try {
      const data = await authService.updateProfile(userData);
      setUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  };

  console.log('Current auth state:', { user, loading });
  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user
  };
  console.log('Providing auth context:', value);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
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
