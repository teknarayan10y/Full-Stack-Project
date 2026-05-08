import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { projectsAPI } from '../utils/api';
import { useAuth } from './AuthContext';

// Create context
const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Initialize projects when user changes
  useEffect(() => {
    // Define an async function inside useEffect
    const initializeProjects = async () => {
      if (!user) {
        setProjects([]);
        setCurrentProject(null);
        return;
      }
      
      try {
        setLoading(true);
        const projectsRes = await projectsAPI.getUserProjects(user._id);
        if (projectsRes && projectsRes.data) {
          setProjects(projectsRes.data);
        }
      } catch (err) {
        console.error('Failed to initialize projects:', err);
        setError('Failed to load projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    // Call the async function
    initializeProjects();
  }, [user]); // Only re-run when user changes

  // Refresh user projects - using useCallback
  const loadUserProjects = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await projectsAPI.getUserProjects(user._id);
      setProjects(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load a specific project - using useCallback
  const loadProject = useCallback(async (projectId) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await projectsAPI.getById(projectId);
      
      // Ensure project has the correct structure
      const project = res.data;
      
      // Make sure project has pages array
      if (!project.pages) {
        project.pages = [{ name: 'Home', components: [] }];
      }
      
      // Make sure each page has components array
      project.pages = project.pages.map(page => {
        if (!page.components) {
          page.components = [];
        }
        return page;
      });
      
      console.log('Loaded project with structure:', project);
      
      setCurrentProject(project);
      return project;
    } catch (err) {
      console.error('Error loading project:', err);
      setError(err.response?.data?.message || 'Failed to load project');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new project - using useCallback
  const createProject = useCallback(async (projectData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Make sure user ID is included
      const res = await projectsAPI.create({
        ...projectData,
        user: user?._id
      });
      
      // Add the new project to the projects list
      const newProject = res.data;
      setProjects(prevProjects => {
        // Check if project already exists in the list
        const exists = prevProjects.some(p => p._id === newProject._id);
        if (exists) {
          return prevProjects;
        }
        return [...prevProjects, newProject];
      });
      
      setCurrentProject(newProject);
      
      // Force a refresh of the projects list to ensure everything is up to date
      await loadUserProjects();
      
      return newProject;
    } catch (err) {
      console.error('Failed to create project:', err);
      setError(err.response?.data?.message || 'Failed to create project');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, loadUserProjects]);

  // Update a project - using useCallback
  const updateProject = useCallback(async (projectId, projectData) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await projectsAPI.update(projectId, projectData);
      
      // Update in projects list
      setProjects(prevProjects =>
        prevProjects.map(project => 
          project._id === projectId ? res.data : project
        )
      );
      
      // Update currentProject if it's the one being updated
      setCurrentProject(prevProject => {
        if (prevProject && prevProject._id === projectId) {
          return res.data;
        }
        return prevProject;
      });
      
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update project');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a project - using useCallback
  const deleteProject = useCallback(async (projectId) => {
    setLoading(true);
    setError(null);
    
    try {
      await projectsAPI.delete(projectId);
      
      // Remove from projects list
      setProjects(prevProjects =>
        prevProjects.filter(project => project._id !== projectId)
      );
      
      // Clear currentProject if it's the one being deleted
      setCurrentProject(prevProject => {
        if (prevProject && prevProject._id === projectId) {
          return null;
        }
        return prevProject;
      });
      
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete project');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a page to current project - using useCallback
  const addPage = useCallback(async (pageData) => {
    if (!currentProject) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await projectsAPI.addPage(currentProject._id, pageData);
      setCurrentProject(res.data);
      
      // Update in projects list
      setProjects(prevProjects =>
        prevProjects.map(project => 
          project._id === currentProject._id ? res.data : project
        )
      );
      
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add page');
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentProject]);

  // Update a page in current project - using useCallback
  const updatePage = useCallback(async (pageId, pageData) => {
    if (!currentProject) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await projectsAPI.updatePage(currentProject._id, pageId, pageData);
      setCurrentProject(res.data);
      
      // Update in projects list
      setProjects(prevProjects =>
        prevProjects.map(project => 
          project._id === currentProject._id ? res.data : project
        )
      );
      
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update page');
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentProject]);

  // Delete a page from current project - using useCallback
  const deletePage = useCallback(async (pageId) => {
    if (!currentProject) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await projectsAPI.deletePage(currentProject._id, pageId);
      setCurrentProject(res.data);
      
      // Update in projects list
      setProjects(prevProjects =>
        prevProjects.map(project => 
          project._id === currentProject._id ? res.data : project
        )
      );
      
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete page');
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentProject]);

  // Publish current project - using useCallback
  const publishProject = useCallback(async (publishData) => {
    if (!currentProject) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await projectsAPI.publish(currentProject._id, publishData);
      setCurrentProject(res.data);
      
      // Update in projects list
      setProjects(prevProjects =>
        prevProjects.map(project => 
          project._id === currentProject._id ? res.data : project
        )
      );
      
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish project');
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentProject]);

  // Clear error - using useCallback
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProject,
        loading,
        error,
        loadUserProjects,
        loadProject,
        createProject,
        updateProject,
        deleteProject,
        addPage,
        updatePage,
        deletePage,
        publishProject,
        clearError,
        setCurrentProject
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

// Custom hook to use project context
export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

export default ProjectContext;
