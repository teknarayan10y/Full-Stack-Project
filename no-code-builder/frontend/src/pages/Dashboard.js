import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import TemplateSelector from '../templates/TemplateSelector';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
  min-height: calc(100vh - ${props => props.theme.components.navbar.height});
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: ${props => props.theme.colors.text.primary};
  position: relative;
  display: inline-block;
  margin-bottom: 1.5rem;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 60px;
    height: 4px;
    background: ${props => props.theme.colors.gradients.blueToRed};
    border-radius: 2px;
  }
`;

const CreateButton = styled.button`
  background-color: #4A90E2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #3A80D2;
  }
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const ProjectCard = styled.div`
  background-color: ${props => props.theme.components.card.backgroundColor};
  border-radius: ${props => props.theme.components.card.borderRadius};
  box-shadow: ${props => props.theme.components.card.boxShadow};
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.components.card.hoverBoxShadow};
  }
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: ${props => props.theme.colors.gradients.blueToRed};
  }
`;

const ProjectHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  background: ${props => props.theme.components.card.headerBackground};
`;

const ProjectName = styled.h3`
  font-size: 1.25rem;
  margin: 0 0 0.5rem;
  color: ${props => props.theme.colors.text.primary};
  font-weight: 600;
`;

const ProjectBody = styled.div`
  padding: 1rem;
`;

const ProjectDescription = styled.p`
  color: #666;
  margin-bottom: 1.5rem;
  min-height: 60px;
`;

const ProjectMeta = styled.div`
  display: flex;
  justify-content: space-between;
  color: #999;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
`;

const ProjectActions = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  gap: 0.5rem;
`;

const ActionButton = styled(Link)`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  text-align: center;
  flex: 1;
  margin: 0 0.25rem;
  transition: background-color 0.3s ease;
`;

const DeleteButton = styled(ActionButton)`
  color: ${props => props.theme.colors.secondary.main};
  
  &:hover {
    background-color: rgba(245, 0, 87, 0.08);
    color: ${props => props.theme.colors.secondary.dark};
  }
`;

const PreviewButton = styled(ActionButton)`
  background-color: #f1f1f1;
  color: #333;
  
  &:hover {
    background-color: #e1e1e1;
  }
`;

const EditButton = styled(ActionButton)`
  background-color: ${props => props.theme.components.button.primary.backgroundColor};
  color: ${props => props.theme.components.button.primary.color};
  border: none;
  border-radius: ${props => props.theme.shape.borderRadius};
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props => props.theme.components.button.primary.boxShadow};

  &:hover {
    background-color: ${props => props.theme.components.button.primary.hoverBackgroundColor};
    box-shadow: ${props => props.theme.shadows.buttonHover};
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: ${props => props.theme.components.card.backgroundColor};
  border-radius: ${props => props.theme.components.card.borderRadius};
  box-shadow: ${props => props.theme.components.card.boxShadow};
  margin-top: 2rem;
`;

const EmptyStateTitle = styled.h2`
  font-size: 1.5rem;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 1rem;
  font-weight: 600;
`;

const EmptyStateText = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 2rem;
  font-size: 1.1rem;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #4A90E2;
  }
`;

const Textarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #4A90E2;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

const CancelButton = styled.button`
background-color: #f5f5f5;
color: #333;
border: 1px solid #ddd;
border-radius: 4px;
padding: 0.75rem 1.5rem;
font-size: 1rem;
cursor: pointer;
transition: background-color 0.3s ease;
  
&:hover {
background-color: #e5e5e5;
}
`;

const SubmitButton = styled.button`
background-color: #4A90E2;
color: white;
border: none;
border-radius: 4px;
padding: 0.75rem 1.5rem;
font-size: 1rem;
cursor: pointer;
transition: background-color 0.3s ease;
  
&:hover {
background-color: #3A80D2;
}
  
&:disabled {
background-color: #A9A9A9;
cursor: not-allowed;
}
`;

const TemplateInfo = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #e9ecef;
`;

const TemplateInfoLabel = styled.div`
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text.primary};
`;

const TemplateInfoValue = styled.div`
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
`;

const TemplateChangeButton = styled.button`
  background-color: transparent;
  color: ${props => props.theme.colors.primary};
  border: 1px solid ${props => props.theme.colors.primary};
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary};
    color: white;
  }
`;

const SaveButton = styled.button`
background-color: ${props => props.theme.components.button.primary.backgroundColor};
color: ${props => props.theme.components.button.primary.color};
border: none;
border-radius: ${props => props.theme.shape.borderRadius};
padding: 0.75rem 1.5rem;
font-size: 1rem;
font-weight: 500;
cursor: pointer;
transition: all 0.3s ease;
box-shadow: ${props => props.theme.components.button.primary.boxShadow};
  color: ${props => props.theme.components.button.primary.color};
  border: none;
  border-radius: ${props => props.theme.shape.borderRadius};
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props => props.theme.components.button.primary.boxShadow};

  &:hover {
    background-color: ${props => props.theme.components.button.primary.hoverBackgroundColor};
    box-shadow: ${props => props.theme.shadows.buttonHover};
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background-color: #A9A9A9;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  background-color: #fde8e7;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  
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

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [newProjectId, setNewProjectId] = useState(null);
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: ''
  });
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { projects, loading, error, loadUserProjects, createProject, deleteProject } = useProject();
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Load user's projects on component mount and whenever modals change
  // This ensures projects are refreshed after creation
  useEffect(() => {
    if (!showModal && !showTemplateModal && !showSuccessModal) {
      loadUserProjects();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal, showTemplateModal, showSuccessModal]);

  const handleOpenModal = () => {
    setShowModal(true);
    setProjectForm({ name: '', description: '' });
    setSelectedTemplate(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  
  const handleOpenTemplateModal = () => {
    setShowModal(false);
    setShowTemplateModal(true);
  };
  
  const handleCloseTemplateModal = () => {
    setShowTemplateModal(false);
    setShowModal(true);
  };
  
  const handleSelectTemplate = (templateStructure) => {
    setSelectedTemplate(templateStructure);
    setShowTemplateModal(false);
    setShowModal(true);
  };

  const handleChange = (e) => {
    setProjectForm({
      ...projectForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!projectForm.name) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Create project data with optional template
    const projectData = {
      name: projectForm.name,
      description: projectForm.description
    };
    
    // If a template was selected, include it in the project data
    if (selectedTemplate) {
      console.log('Selected template:', selectedTemplate);
      
      // Create a flattened structure of the template components
      // This approach converts the nested template structure into individual components
      // that can be directly rendered by the Canvas
      
      // Start with the main container component
      const mainComponent = {
        id: Math.random().toString(36).substr(2, 9),
        type: selectedTemplate.type,
        props: selectedTemplate.props || {},
        style: selectedTemplate.style || {},
        position: { x: 10, y: 10 }
      };
      
      // Collect all components to be added
      const components = [mainComponent];
      
      // Process children recursively and flatten the structure
      const processChildren = (parentId, children) => {
        if (!children || !Array.isArray(children)) return;
        
        children.forEach(child => {
          // Create a component for this child
          const childId = Math.random().toString(36).substr(2, 9);
          const childComponent = {
            id: childId,
            type: child.type,
            props: child.props || {},
            style: child.style || {},
            parentId: parentId,
            position: child.position || { x: 0, y: 0 }
          };
          
          // Add this component to the list
          components.push(childComponent);
          
          // Process this child's children
          if (child.children && Array.isArray(child.children)) {
            processChildren(childId, child.children);
          }
        });
      };
      
      // Process the template's children
      if (selectedTemplate.children && Array.isArray(selectedTemplate.children)) {
        processChildren(mainComponent.id, selectedTemplate.children);
      }
      
      console.log('Flattened components:', components);
      
      // Add the components to the first page
      projectData.pages = [
        {
          name: 'Home',
          components: components
        }
      ];
      
      console.log('Project data with template:', projectData);
    }
    
    const newProject = await createProject(projectData);
    
    setIsSubmitting(false);
    
    if (newProject) {
      // Close the create modal
      setShowModal(false);
      
      // Force refresh the projects list
      await loadUserProjects();
      
      // Show success modal with options
      setNewProjectId(newProject._id);
      setShowSuccessModal(true);
    }
  };
  
  const handleEditNow = () => {
    setShowSuccessModal(false);
    navigate(`/builder/${newProjectId}`);
  };
  
  const handleStayOnDashboard = () => {
    setShowSuccessModal(false);
  };

  const handleDeleteProject = async (projectId, e) => {
    e.preventDefault();
    
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      await deleteProject(projectId);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <DashboardContainer>
        <LoadingSpinner>
          <div className="spinner"></div>
        </LoadingSpinner>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Header>
        <Title>My Projects</Title>
        <CreateButton onClick={handleOpenModal}>
          <span>Create New Project</span>
        </CreateButton>
      </Header>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {projects.length === 0 ? (
        <EmptyState>
          <EmptyStateTitle>No Projects Yet</EmptyStateTitle>
          <EmptyStateText>
            Create your first no-code app project to get started!
          </EmptyStateText>
          <CreateButton onClick={handleOpenModal}>
            <span>Create New Project</span>
          </CreateButton>
        </EmptyState>
      ) : (
        <ProjectsGrid>
          {projects.map((project) => (
            <ProjectCard key={project._id}>
              <ProjectHeader>
                <ProjectName>{project.name}</ProjectName>
              </ProjectHeader>
              <ProjectBody>
                <ProjectDescription>
                  {project.description || 'No description provided.'}
                </ProjectDescription>
                <ProjectMeta>
                  <span>Created: {formatDate(project.createdAt)}</span>
                  <span>{project.pages.length} Pages</span>
                </ProjectMeta>
                <ProjectActions>
                  <EditButton to={`/builder/${project._id}`}>Edit</EditButton>
                  <PreviewButton to={`/preview/${project._id}`}>Preview</PreviewButton>
                  <DeleteButton onClick={(e) => handleDeleteProject(project._id, e)}>
                    Delete
                  </DeleteButton>
                </ProjectActions>
              </ProjectBody>
            </ProjectCard>
          ))}
        </ProjectsGrid>
      )}
      
      {showModal && (
        <Modal>
          <ModalContent>
            <ModalTitle>Create New Project</ModalTitle>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="name">Project Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={projectForm.name}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={projectForm.description}
                  onChange={handleChange}
                  rows="4"
                />
              </FormGroup>
              
              {selectedTemplate ? (
                <TemplateInfo>
                  <TemplateInfoLabel>Selected Template:</TemplateInfoLabel>
                  <TemplateInfoValue>
                    <i className="fas fa-check-circle" style={{ color: '#4CAF50', marginRight: '8px' }}></i>
                    Layout template selected
                  </TemplateInfoValue>
                  <TemplateChangeButton type="button" onClick={handleOpenTemplateModal}>
                    Change Template
                  </TemplateChangeButton>
                </TemplateInfo>
              ) : (
                <TemplateInfo>
                  <TemplateInfoLabel>Template:</TemplateInfoLabel>
                  <TemplateInfoValue>No template selected (starting from scratch)</TemplateInfoValue>
                  <TemplateChangeButton type="button" onClick={handleOpenTemplateModal}>
                    Choose Template
                  </TemplateChangeButton>
                </TemplateInfo>
              )}
              
              <ButtonGroup>
                <CancelButton type="button" onClick={handleCloseModal}>
                  Cancel
                </CancelButton>
                <SubmitButton type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Project'}
                </SubmitButton>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}
      
      {showTemplateModal && (
        <Modal>
          <ModalContent style={{ maxWidth: '800px', width: '90%', maxHeight: '80vh', overflowY: 'auto' }}>
            <TemplateSelector 
              onSelect={handleSelectTemplate} 
              onCancel={handleCloseTemplateModal} 
            />
          </ModalContent>
        </Modal>
      )}
      
      {showSuccessModal && (
        <Modal>
          <ModalContent>
            <ModalTitle>Project Created Successfully!</ModalTitle>
            <p style={{ marginBottom: '1.5rem' }}>Your new project has been created. What would you like to do next?</p>
            <ButtonGroup>
              <SubmitButton onClick={handleEditNow}>
                Edit Project Now
              </SubmitButton>
              <CancelButton onClick={handleStayOnDashboard}>
                Stay on Dashboard
              </CancelButton>
            </ButtonGroup>
          </ModalContent>
        </Modal>
      )}
    </DashboardContainer>
  );
};

export default Dashboard;
