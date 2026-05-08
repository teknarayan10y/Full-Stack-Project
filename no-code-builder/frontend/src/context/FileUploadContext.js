import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

// Create context
const FileUploadContext = createContext();

export const FileUploadProvider = ({ children }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Upload a file
  const uploadFile = useCallback(async (file, onProgress) => {
    if (!user) {
      setError('You must be logged in to upload files');
      return null;
    }

    setUploading(true);
    setUploadProgress(0);
    setError(null);

    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', user._id);

    try {
      // Upload file with progress tracking
      const response = await axios.post('/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
          if (onProgress) onProgress(percentCompleted);
        }
      });

      // Add the new file to the files state
      const newFile = response.data;
      setFiles(prevFiles => [...prevFiles, newFile]);
      
      return newFile;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload file');
      return null;
    } finally {
      setUploading(false);
    }
  }, [user]);

  // Upload multiple files
  const uploadFiles = useCallback(async (fileList) => {
    if (!user) {
      setError('You must be logged in to upload files');
      return [];
    }

    setUploading(true);
    setError(null);

    const uploadedFiles = [];
    const totalFiles = fileList.length;
    
    for (let i = 0; i < totalFiles; i++) {
      try {
        const file = fileList[i];
        const result = await uploadFile(file);
        if (result) {
          uploadedFiles.push(result);
        }
        setUploadProgress(Math.round(((i + 1) / totalFiles) * 100));
      } catch (err) {
        console.error(`Error uploading file ${i + 1}:`, err);
      }
    }

    setUploading(false);
    return uploadedFiles;
  }, [user, uploadFile]);

  // Get all user files
  const getUserFiles = useCallback(async () => {
    if (!user) return;
    
    setUploading(true);
    setError(null);
    
    try {
      const response = await axios.get(`/api/files/user/${user._id}`);
      setFiles(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get files');
      return [];
    } finally {
      setUploading(false);
    }
  }, [user]);

  // Delete a file
  const deleteFile = useCallback(async (fileId) => {
    if (!user) return false;
    
    setUploading(true);
    setError(null);
    
    try {
      await axios.delete(`/api/files/${fileId}`);
      setFiles(prevFiles => prevFiles.filter(file => file._id !== fileId));
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete file');
      return false;
    } finally {
      setUploading(false);
    }
  }, [user]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initialize files when component mounts
  React.useEffect(() => {
    if (user) {
      getUserFiles();
    } else {
      setFiles([]);
    }
  }, [user, getUserFiles]);

  return (
    <FileUploadContext.Provider
      value={{
        files,
        uploading,
        uploadProgress,
        error,
        uploadFile,
        uploadFiles,
        getUserFiles,
        deleteFile,
        clearError
      }}
    >
      {children}
    </FileUploadContext.Provider>
  );
};

// Custom hook to use file upload context
export const useFileUpload = () => {
  const context = useContext(FileUploadContext);
  if (!context) {
    throw new Error('useFileUpload must be used within a FileUploadProvider');
  }
  return context;
};

export default FileUploadContext;
