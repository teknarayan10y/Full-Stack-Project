import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useProject } from '../context/ProjectContext';
import { useBuilder } from '../context/BuilderContext';
import ComponentPanel from '../components/builder/ComponentPanel';
import Canvas from '../components/builder/Canvas';
import PropertyPanel from '../components/builder/PropertyPanel';

const BuilderContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px); /* Adjust based on navbar height */
`;

const BuilderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: white;
  border-bottom: 1px solid #eee;
`;

const ProjectTitle = styled.h1`
  font-size: 1.5rem;
  margin: 0;
  color: #333;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const PrimaryButton = styled(Button)`
  background-color: #4A90E2;
  color: white;
  border: none;
  
  &:hover {
    background-color: #3A80D2;
  }
`;

const SecondaryButton = styled(Button)`
  background-color: white;
  color: #333;
  border: 1px solid #ddd;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const BuilderContent = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr 300px;
  gap: 1rem;
  padding: 1rem;
  flex: 1;
  overflow: hidden;
`;

const PanelWrapper = styled.div`
  height: 100%;
  overflow: hidden;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  
  .spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top: 4px solid #4A90E2;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 2rem;
  text-align: center;
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  background-color: #fde8e7;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  max-width: 500px;
`;

const Builder = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { currentProject, loadProject, updateProject, loading, error } = useProject();
  const { undo, redo, canUndo, canRedo } = useBuilder();
  const [isSaving, setIsSaving] = useState(false);

  // Load project on component mount
  useEffect(() => {
    loadProject(projectId);
  }, [projectId, loadProject]);

  // Handle save project
  const handleSave = async () => {
    if (!currentProject) return;
    
    setIsSaving(true);
    
    await updateProject(currentProject._id, currentProject);
    
    setIsSaving(false);
  };

  // Handle preview
  const handlePreview = () => {
    navigate(`/preview/${projectId}`);
  };

  // Handle publish
  const handlePublish = async () => {
    if (!currentProject) return;
    
    setIsSaving(true);
    
    await updateProject(currentProject._id, {
      ...currentProject,
      published: true
    });
    
    setIsSaving(false);
  };

  // Handle back to dashboard
  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <LoadingContainer>
        <div className="spinner"></div>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer>
        <ErrorMessage>{error}</ErrorMessage>
        <SecondaryButton onClick={handleBackToDashboard}>
          Back to Dashboard
        </SecondaryButton>
      </ErrorContainer>
    );
  }

  if (!currentProject) {
    return (
      <ErrorContainer>
        <ErrorMessage>Project not found</ErrorMessage>
        <SecondaryButton onClick={handleBackToDashboard}>
          Back to Dashboard
        </SecondaryButton>
      </ErrorContainer>
    );
  }

  return (
    <BuilderContainer>
      <BuilderHeader>
        <ProjectTitle>{currentProject.name}</ProjectTitle>
        
        <HeaderActions>
          <SecondaryButton onClick={undo} disabled={!canUndo}>
            Undo
          </SecondaryButton>
          <SecondaryButton onClick={redo} disabled={!canRedo}>
            Redo
          </SecondaryButton>
          <SecondaryButton onClick={handlePreview}>
            Preview
          </SecondaryButton>
          <PrimaryButton onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save'}
          </PrimaryButton>
          <PrimaryButton 
            onClick={handlePublish} 
            disabled={isSaving || currentProject.published}
          >
            {currentProject.published ? 'Published' : 'Publish'}
          </PrimaryButton>
        </HeaderActions>
      </BuilderHeader>
      
      <BuilderContent>
        <PanelWrapper>
          <ComponentPanel />
        </PanelWrapper>
        
        <PanelWrapper>
          <Canvas />
        </PanelWrapper>
        
        <PanelWrapper>
          <PropertyPanel />
        </PanelWrapper>
      </BuilderContent>
    </BuilderContainer>
  );
};

export default Builder;
