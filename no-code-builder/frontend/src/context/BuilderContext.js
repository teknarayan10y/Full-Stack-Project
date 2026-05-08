import React, { createContext, useState, useContext, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useProject } from './ProjectContext';

// Create context
const BuilderContext = createContext();

export const BuilderProvider = ({ children }) => {
  const { currentProject, updateProject, setCurrentProject } = useProject();
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [selectedPageIndex, setSelectedPageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showComponentProperties, setShowComponentProperties] = useState(false);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Get current page
  const getCurrentPage = () => {
    if (!currentProject) {
      console.log('No current project');
      return null;
    }
    
    if (!currentProject.pages) {
      console.log('Project has no pages array');
      return null;
    }
    
    if (currentProject.pages.length === 0) {
      console.log('Project has empty pages array');
      return null;
    }
    
    // Get the current page
    const page = currentProject.pages[selectedPageIndex];
    
    // Ensure the page has a components array
    if (!page.components) {
      console.log('Page has no components array, creating empty array');
      // Create a new copy of the page with an empty components array
      const updatedPage = { ...page, components: [] };
      
      // Update the project with the fixed page
      const updatedPages = [...currentProject.pages];
      updatedPages[selectedPageIndex] = updatedPage;
      
      // Update the current project (without triggering a backend update)
      setCurrentProject({
        ...currentProject,
        pages: updatedPages
      });
      
      return updatedPage;
    }
    
    // Debug the current project structure
    console.log('Current project structure:', currentProject);
    console.log('Selected page index:', selectedPageIndex);
    console.log('Current page:', page);
    
    return page;
  };
  
  // Save current state to undo stack
  const saveToUndoStack = useCallback(() => {
    if (!currentProject) return;
    
    setUndoStack(prevStack => [
      ...prevStack,
      JSON.stringify(currentProject)
    ]);
    
    // Clear redo stack when a new action is performed
    setRedoStack([]);
  }, [currentProject]);

  // Add component to page
  const addComponent = useCallback((componentType, props, position) => {
    console.log('Adding component:', componentType, position);
    if (!currentProject) {
      console.error('No current project');
      return;
    }

    const currentPage = getCurrentPage();
    if (!currentPage) {
      console.error('No current page');
      return;
    }

    // Create new component with unique ID
    const newComponent = {
      id: uuidv4(),
      type: componentType,
      props: props.defaultProps || {},
      style: props.defaultStyle || {},
      position: position || { x: 0, y: 0 },
      children: []
    };

    console.log('Created new component:', newComponent);

    // Save current state to undo stack
    saveToUndoStack();

    // Add component to page
    const updatedPages = [...currentProject.pages];
    updatedPages[selectedPageIndex] = {
      ...currentPage,
      components: [...currentPage.components, newComponent]
    };

    // Update project
    updateProject(currentProject._id, {
      ...currentProject,
      pages: updatedPages
    });

    return newComponent;
  }, [currentProject, selectedPageIndex, updateProject]);

  // Update component properties
  const updateComponentProps = useCallback((componentId, newProps) => {
    console.log('Updating component props:', componentId, newProps);
    if (!currentProject) return;

    const currentPage = getCurrentPage();
    if (!currentPage) return;

    // Save current state to undo stack
    saveToUndoStack();

    // Find and update component
    const updatedComponents = currentPage.components.map(component => {
      if (component.id === componentId) {
        return {
          ...component,
          props: {
            ...component.props,
            ...newProps
          }
        };
      }
      return component;
    });

    // Update page
    const updatedPages = [...currentProject.pages];
    updatedPages[selectedPageIndex] = {
      ...currentPage,
      components: updatedComponents
    };

    // Update project
    updateProject(currentProject._id, {
      ...currentProject,
      pages: updatedPages
    });
  }, [currentProject, selectedPageIndex, updateProject]);

  // Update component style
  const updateComponentStyle = (componentId, newStyle) => {
    if (!currentProject) return;

    const currentPage = getCurrentPage();
    if (!currentPage) return;

    // Save current state to undo stack
    saveToUndoStack();

    // Find and update component
    const updatedComponents = currentPage.components.map(component => {
      if (component.id === componentId) {
        return {
          ...component,
          style: {
            ...component.style,
            ...newStyle
          }
        };
      }
      return component;
    });

    // Update page
    const updatedPages = [...currentProject.pages];
    updatedPages[selectedPageIndex] = {
      ...currentPage,
      components: updatedComponents
    };

    // Update project
    updateProject(currentProject._id, {
      ...currentProject,
      pages: updatedPages
    });
  };

  // Update component position
  const updateComponentPosition = (componentId, newPosition) => {
    if (!currentProject) return;

    const currentPage = getCurrentPage();
    if (!currentPage) return;

    // Find and update component
    const updatedComponents = currentPage.components.map(component => {
      if (component.id === componentId) {
        return {
          ...component,
          position: newPosition
        };
      }
      return component;
    });

    // Update page
    const updatedPages = [...currentProject.pages];
    updatedPages[selectedPageIndex] = {
      ...currentPage,
      components: updatedComponents
    };

    // Update project
    updateProject(currentProject._id, {
      ...currentProject,
      pages: updatedPages
    });
  };

  // Delete component
  const deleteComponent = (componentId) => {
    if (!currentProject) return;

    const currentPage = getCurrentPage();
    if (!currentPage) return;

    // Save current state to undo stack
    saveToUndoStack();

    // Filter out the component to delete
    const updatedComponents = currentPage.components.filter(
      component => component.id !== componentId
    );

    // Update page
    const updatedPages = [...currentProject.pages];
    updatedPages[selectedPageIndex] = {
      ...currentPage,
      components: updatedComponents
    };

    // Update project
    updateProject(currentProject._id, {
      ...currentProject,
      pages: updatedPages
    });

    // Clear selected component if it was deleted
    if (selectedComponent && selectedComponent.id === componentId) {
      setSelectedComponent(null);
      setShowComponentProperties(false);
    }
  };

  // Add child component
  const addChildComponent = (parentId, childComponent) => {
    if (!currentProject) return;

    const currentPage = getCurrentPage();
    if (!currentPage) return;

    // Save current state to undo stack
    saveToUndoStack();

    // Find parent and add child
    const updatedComponents = currentPage.components.map(component => {
      if (component.id === parentId) {
        return {
          ...component,
          children: [...component.children, childComponent]
        };
      }
      return component;
    });

    // Update page
    const updatedPages = [...currentProject.pages];
    updatedPages[selectedPageIndex] = {
      ...currentPage,
      components: updatedComponents
    };

    // Update project
    updateProject(currentProject._id, {
      ...currentProject,
      pages: updatedPages
    });
  };

  // Remove child component
  const removeChildComponent = (parentId, childId) => {
    if (!currentProject) return;

    const currentPage = getCurrentPage();
    if (!currentPage) return;

    // Save current state to undo stack
    saveToUndoStack();

    // Find parent and remove child
    const updatedComponents = currentPage.components.map(component => {
      if (component.id === parentId) {
        return {
          ...component,
          children: component.children.filter(child => child.id !== childId)
        };
      }
      return component;
    });

    // Update page
    const updatedPages = [...currentProject.pages];
    updatedPages[selectedPageIndex] = {
      ...currentPage,
      components: updatedComponents
    };

    // Update project
    updateProject(currentProject._id, {
      ...currentProject,
      pages: updatedPages
    });
  };

  // This function has been moved to the top of the component

  // Undo last action
  const undo = () => {
    if (undoStack.length === 0 || !currentProject) return;

    // Save current state to redo stack
    setRedoStack([...redoStack, JSON.stringify(currentProject)]);

    // Pop last state from undo stack
    const newUndoStack = [...undoStack];
    const lastState = newUndoStack.pop();
    setUndoStack(newUndoStack);

    // Restore last state
    const restoredProject = JSON.parse(lastState);
    updateProject(currentProject._id, restoredProject);
  };

  // Redo last undone action
  const redo = () => {
    if (redoStack.length === 0 || !currentProject) return;

    // Save current state to undo stack
    setUndoStack([...undoStack, JSON.stringify(currentProject)]);

    // Pop last state from redo stack
    const newRedoStack = [...redoStack];
    const nextState = newRedoStack.pop();
    setRedoStack(newRedoStack);

    // Restore next state
    const restoredProject = JSON.parse(nextState);
    updateProject(currentProject._id, restoredProject);
  };

  // Select a component
  const selectComponent = (component) => {
    setSelectedComponent(component);
    setShowComponentProperties(true);
  };

  // Deselect component
  const deselectComponent = () => {
    setSelectedComponent(null);
    setShowComponentProperties(false);
  };

  // Change selected page
  const changePage = (pageIndex) => {
    if (pageIndex >= 0 && pageIndex < currentProject.pages.length) {
      setSelectedPageIndex(pageIndex);
      deselectComponent();
    }
  };

  return (
    <BuilderContext.Provider
      value={{
        selectedComponent,
        selectedPageIndex,
        isDragging,
        showComponentProperties,
        getCurrentPage,
        addComponent,
        updateComponentProps,
        updateComponentStyle,
        updateComponentPosition,
        deleteComponent,
        addChildComponent,
        removeChildComponent,
        selectComponent,
        deselectComponent,
        changePage,
        setIsDragging,
        setShowComponentProperties,
        undo,
        redo,
        canUndo: undoStack.length > 0,
        canRedo: redoStack.length > 0
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
};

// Custom hook to use builder context
export const useBuilder = () => {
  const context = useContext(BuilderContext);
  if (!context) {
    throw new Error('useBuilder must be used within a BuilderProvider');
  }
  return context;
};

export default BuilderContext;
