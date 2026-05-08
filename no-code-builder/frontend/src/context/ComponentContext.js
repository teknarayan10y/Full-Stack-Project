import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { componentsAPI } from '../utils/api';
import { useAuth } from './AuthContext';

// Create context
const ComponentContext = createContext();

export const ComponentProvider = ({ children }) => {
  const [components, setComponents] = useState([]);
  const [userComponents, setUserComponents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Initialize components when component mounts
  useEffect(() => {
    // Define an async function inside useEffect
    const initializeComponents = async () => {
      try {
        setLoading(true);
        
        // Load all components
        const allComponentsRes = await componentsAPI.getAll();
        if (allComponentsRes && allComponentsRes.data) {
          setComponents(allComponentsRes.data);
        }
      } catch (err) {
        console.error('Failed to initialize components:', err);
        setError('Failed to load components. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    // Call the async function
    initializeComponents();
  }, []); // Empty dependency array - only run once
  
  // Load user components when user changes
  useEffect(() => {
    // Define an async function inside useEffect
    const loadUserComponentsData = async () => {
      if (!user) {
        setUserComponents([]);
        return;
      }
      
      try {
        setLoading(true);
        const userComponentsRes = await componentsAPI.getUserComponents(user._id);
        if (userComponentsRes && userComponentsRes.data) {
          setUserComponents(userComponentsRes.data);
        }
      } catch (err) {
        console.error('Failed to load user components:', err);
        setError('Failed to load user components. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    // Call the async function
    loadUserComponentsData();
  }, [user]); // Only re-run when user changes

  // Refresh all components - using useCallback
  const refreshComponents = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await componentsAPI.getAll();
      setComponents(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load components');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load components by category - using useCallback to prevent recreation on each render
  const loadComponentsByCategory = useCallback(async (category) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await componentsAPI.getByCategory(category);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load components');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh user components - using useCallback
  const refreshUserComponents = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await componentsAPI.getUserComponents(user._id);
      setUserComponents(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load custom components');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Create a custom component - using useCallback
  const createComponent = useCallback(async (componentData) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await componentsAPI.create(componentData);
      setUserComponents(prevComponents => [...prevComponents, res.data]);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create component');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update a component - using useCallback
  const updateComponent = useCallback(async (id, componentData) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await componentsAPI.update(id, componentData);
      
      // Update in components list if it's a system component
      setComponents(prevComponents =>
        prevComponents.map(component => 
          component._id === id ? res.data : component
        )
      );
      
      // Update in userComponents list if it's a user component
      setUserComponents(prevComponents =>
        prevComponents.map(component => 
          component._id === id ? res.data : component
        )
      );
      
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update component');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a component - using useCallback
  const deleteComponent = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await componentsAPI.delete(id);
      
      // Remove from userComponents list
      setUserComponents(prevComponents =>
        prevComponents.filter(component => component._id !== id)
      );
      
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete component');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Clone a component - using useCallback
  const cloneComponent = useCallback(async (id, cloneData) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await componentsAPI.clone(id, cloneData);
      setUserComponents(prevComponents => [...prevComponents, res.data]);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to clone component');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get all available components (built-in + user's custom)
  const getAllAvailableComponents = useCallback(() => {
    return [...components, ...userComponents];
  }, [components, userComponents]);

  // Clear error - using useCallback
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <ComponentContext.Provider
      value={{
        components,
        userComponents,
        loading,
        error,
        refreshComponents,
        loadComponentsByCategory,
        refreshUserComponents,
        createComponent,
        updateComponent,
        deleteComponent,
        cloneComponent,
        getAllAvailableComponents,
        clearError
      }}
    >
      {children}
    </ComponentContext.Provider>
  );
};

// Custom hook to use component context
export const useComponent = () => {
  const context = useContext(ComponentContext);
  if (!context) {
    throw new Error('useComponent must be used within a ComponentProvider');
  }
  return context;
};

export default ComponentContext;
