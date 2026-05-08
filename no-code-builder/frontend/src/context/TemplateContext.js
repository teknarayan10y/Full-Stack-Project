import React, { createContext, useState, useCallback, useContext, useEffect } from 'react';
import { templatesAPI } from '../utils/api';
import { useAuth } from './AuthContext';

// Create context
const TemplateContext = createContext();

export const TemplateProvider = ({ children }) => {
  const [templates, setTemplates] = useState([]);
  const [userTemplates, setUserTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Initialize templates when component mounts or user changes
  useEffect(() => {
    if (user) {
      // Define an async function inside useEffect
      const initializeTemplates = async () => {
        try {
          setLoading(true);
          
          // Load public templates
          const publicRes = await templatesAPI.getAll();
          if (publicRes && publicRes.data) {
            setTemplates(publicRes.data);
          }
          
          // Load user templates
          const userRes = await templatesAPI.getUserTemplates();
          if (userRes && userRes.data) {
            setUserTemplates(userRes.data);
          }
        } catch (err) {
          console.error('Failed to initialize templates:', err);
          setError('Failed to load templates. Please try again later.');
        } finally {
          setLoading(false);
        }
      };
      
      // Call the async function
      initializeTemplates();
    } else {
      // Reset state when user logs out
      setTemplates([]);
      setUserTemplates([]);
    }
  }, [user]); // Only re-run when user changes

  // Refresh templates data - using useCallback to prevent recreation on each render
  const refreshTemplates = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Load all templates
      const allTemplatesRes = await templatesAPI.getAll();
      setTemplates(allTemplatesRes.data);
      
      // Load user templates
      const userTemplatesRes = await templatesAPI.getUserTemplates();
      setUserTemplates(userTemplatesRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load templates');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load templates by category - using useCallback
  const loadTemplatesByCategory = useCallback(async (category) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await templatesAPI.getByCategory(category);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load templates');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);



  // Get template by ID - using useCallback
  const getTemplateById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await templatesAPI.getById(id);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load template');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a template - using useCallback
  const createTemplate = useCallback(async (templateData) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await templatesAPI.create(templateData);
      setUserTemplates(prevTemplates => [...prevTemplates, res.data]);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create template');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update a template - using useCallback
  const updateTemplate = useCallback(async (id, templateData) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await templatesAPI.update(id, templateData);
      
      // Update in userTemplates list
      setUserTemplates(prevTemplates =>
        prevTemplates.map(template => 
          template._id === id ? res.data : template
        )
      );
      
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update template');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a template - using useCallback
  const deleteTemplate = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await templatesAPI.delete(id);
      
      // Remove from userTemplates list
      setUserTemplates(prevTemplates =>
        prevTemplates.filter(template => template._id !== id)
      );
      
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete template');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Save selected components as a template - using useCallback
  const saveAsTemplate = useCallback(async (name, description, category, components, isPublic = false) => {
    // Generate a thumbnail (could be implemented with canvas or a screenshot service)
    const thumbnail = 'https://via.placeholder.com/150';
    
    return createTemplate({
      name,
      description,
      category,
      components,
      thumbnail,
      isPublic
    });
  }, [createTemplate]);

  // Clear error - using useCallback
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <TemplateContext.Provider
      value={{
        templates,
        userTemplates,
        loading,
        error,
        refreshTemplates,
        loadTemplatesByCategory,
        getTemplateById,
        createTemplate,
        updateTemplate,
        deleteTemplate,
        saveAsTemplate,
        clearError
      }}
    >
      {children}
    </TemplateContext.Provider>
  );
};

// Custom hook to use template context
export const useTemplate = () => {
  const context = useContext(TemplateContext);
  if (!context) {
    throw new Error('useTemplate must be used within a TemplateProvider');
  }
  return context;
};

export default TemplateContext;
