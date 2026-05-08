import React, { createContext, useState, useEffect, useContext } from 'react';
import { formValidationsAPI } from '../utils/api';
import { useAuth } from './AuthContext';

// Create context
const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const [formValidations, setFormValidations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Load all form validations on initial render
  useEffect(() => {
    if (user) {
      loadFormValidations();
    }
  }, [user]);

  // Load all form validations
  const loadFormValidations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await formValidationsAPI.getAll();
      setFormValidations(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load form validations');
    } finally {
      setLoading(false);
    }
  };

  // Get form validation by ID
  const getFormValidationById = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await formValidationsAPI.getById(id);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load form validation');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create a form validation
  const createFormValidation = async (formValidationData) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await formValidationsAPI.create(formValidationData);
      setFormValidations([...formValidations, res.data]);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create form validation');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update a form validation
  const updateFormValidation = async (id, formValidationData) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await formValidationsAPI.update(id, formValidationData);
      
      // Update in formValidations list
      setFormValidations(
        formValidations.map(formValidation => 
          formValidation._id === id ? res.data : formValidation
        )
      );
      
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update form validation');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete a form validation
  const deleteFormValidation = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await formValidationsAPI.delete(id);
      
      // Remove from formValidations list
      setFormValidations(
        formValidations.filter(formValidation => formValidation._id !== id)
      );
      
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete form validation');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Validate form data
  const validateFormData = async (formId, formData) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await formValidationsAPI.validate(formId, formData);
      return res.data;
    } catch (err) {
      if (err.response?.status === 400) {
        // Validation errors
        return { valid: false, errors: err.response.data.errors };
      }
      
      setError(err.response?.data?.message || 'Failed to validate form data');
      return { valid: false, errors: {} };
    } finally {
      setLoading(false);
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return (
    <FormContext.Provider
      value={{
        formValidations,
        loading,
        error,
        loadFormValidations,
        getFormValidationById,
        createFormValidation,
        updateFormValidation,
        deleteFormValidation,
        validateFormData,
        clearError
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

// Custom hook to use form context
export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
};

export default FormContext;
