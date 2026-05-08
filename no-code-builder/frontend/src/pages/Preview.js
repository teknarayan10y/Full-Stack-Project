import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { projectsAPI } from '../utils/api';

const PreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px);
`;

const PreviewHeader = styled.div`
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

const SecondaryButton = styled(Button)`
  background-color: white;
  color: #333;
  border: 1px solid #ddd;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const PreviewContent = styled.div`
  flex: 1;
  overflow: auto;
  background-color: #f5f5f5;
`;

const PreviewFrame = styled.div`
  background-color: white;
  max-width: 1200px;
  min-height: 100%;
  margin: 0 auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const PageTabs = styled.div`
  display: flex;
  background-color: #f9f9f9;
  border-bottom: 1px solid #eee;
  overflow-x: auto;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 4px;
  }
`;

const PageTab = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.active ? 'white' : 'transparent'};
  border: none;
  border-bottom: 2px solid ${props => props.active ? '#4A90E2' : 'transparent'};
  color: ${props => props.active ? '#4A90E2' : '#666'};
  font-weight: ${props => props.active ? '500' : 'normal'};
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.active ? 'white' : '#f5f5f5'};
  }
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

// Component renderer
const ComponentRenderer = ({ component }) => {
  const { type, props, style, children } = component;
  
  // Default styles
  const defaultStyle = {
    ...style
  };
  
  // Render based on component type
  switch (type) {
    case 'Container':
      return (
        <div style={defaultStyle}>
          {props.text || ''}
          {children && children.map(child => (
            <ComponentRenderer key={child.id} component={child} />
          ))}
        </div>
      );
      
    case 'Row':
      return (
        <div style={defaultStyle}>
          {props.text || ''}
          {children && children.map(child => (
            <ComponentRenderer key={child.id} component={child} />
          ))}
        </div>
      );
      
    case 'Column':
      return (
        <div style={defaultStyle}>
          {props.text || ''}
          {children && children.map(child => (
            <ComponentRenderer key={child.id} component={child} />
          ))}
        </div>
      );
      
    case 'Text':
      return (
        <p style={defaultStyle}>
          {props.text || 'Text component'}
        </p>
      );
      
    case 'Heading':
      const HeadingTag = props.level || 'h2';
      return (
        <HeadingTag style={defaultStyle}>
          {props.text || 'Heading'}
        </HeadingTag>
      );
      
    case 'Button':
      return (
        <button style={defaultStyle}>
          {props.text || 'Button'}
        </button>
      );
      
    case 'Image':
      return (
        <img 
          src={props.src || 'https://via.placeholder.com/150'} 
          alt={props.alt || 'Image'} 
          style={defaultStyle}
        />
      );
      
    case 'TextInput':
      return (
        <div style={{ marginBottom: '1rem' }}>
          {props.label && (
            <label style={{ display: 'block', marginBottom: '5px' }}>
              {props.label}
            </label>
          )}
          <input
            type={props.type || 'text'}
            placeholder={props.placeholder || 'Enter text...'}
            style={defaultStyle}
          />
        </div>
      );
      
    case 'Card':
      return (
        <div style={defaultStyle}>
          {props.title && (
            <div style={{ 
              fontWeight: 'bold', 
              marginBottom: '10px',
              fontSize: '1.1em'
            }}>
              {props.title}
            </div>
          )}
          {props.text || ''}
          {children && children.map(child => (
            <ComponentRenderer key={child.id} component={child} />
          ))}
        </div>
      );
      
    default:
      return (
        <div style={defaultStyle}>
          Unknown component: {type}
        </div>
      );
  }
};

// Page renderer
const PageRenderer = ({ page }) => {
  if (!page || !page.components) {
    return <div>Empty page</div>;
  }
  
  return (
    <div style={{ padding: '2rem' }}>
      {page.components.map(component => (
        <ComponentRenderer 
          key={component.id} 
          component={component}
        />
      ))}
    </div>
  );
};

const Preview = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePage, setActivePage] = useState(0);
  
  // Load project on component mount
  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true);
        const res = await projectsAPI.getById(projectId);
        setProject(res.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load project');
        setLoading(false);
      }
    };
    
    loadProject();
  }, [projectId]);
  
  // Handle back to editor
  const handleBackToEditor = () => {
    navigate(`/builder/${projectId}`);
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
  
  if (!project) {
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
    <PreviewContainer>
      <PreviewHeader>
        <ProjectTitle>Preview: {project.name}</ProjectTitle>
        
        <HeaderActions>
          <SecondaryButton onClick={handleBackToEditor}>
            Back to Editor
          </SecondaryButton>
          <SecondaryButton onClick={handleBackToDashboard}>
            Back to Dashboard
          </SecondaryButton>
        </HeaderActions>
      </PreviewHeader>
      
      <PreviewContent>
        <PreviewFrame>
          {project.pages && project.pages.length > 0 && (
            <>
              <PageTabs>
                {project.pages.map((page, index) => (
                  <PageTab
                    key={index}
                    active={activePage === index}
                    onClick={() => setActivePage(index)}
                  >
                    {page.name}
                  </PageTab>
                ))}
              </PageTabs>
              
              <PageRenderer page={project.pages[activePage]} />
            </>
          )}
        </PreviewFrame>
      </PreviewContent>
    </PreviewContainer>
  );
};

export default Preview;
