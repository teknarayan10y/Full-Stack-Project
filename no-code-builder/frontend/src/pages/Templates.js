import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTemplate } from '../context/TemplateContext';

const TemplatesContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
`;

const CategoryTabs = styled.div`
  display: flex;
  margin-bottom: 2rem;
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

// Create a custom component that doesn't pass the active prop to the DOM
const CategoryTabBase = ({ active, ...props }) => <button {...props} />;

const CategoryTab = styled(CategoryTabBase)`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.active ? '#f5f5f5' : 'transparent'};
  border: none;
  border-bottom: 2px solid ${props => props.active ? '#4A90E2' : 'transparent'};
  color: ${props => props.active ? '#4A90E2' : '#666'};
  font-weight: ${props => props.active ? '500' : 'normal'};
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const TemplatesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
`;

const TemplateCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const TemplateImage = styled.div`
  height: 150px;
  background-color: #f5f5f5;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.5) 100%);
  }
`;

const TemplateInfo = styled.div`
  padding: 1rem;
`;

const TemplateName = styled.h3`
  font-size: 1.1rem;
  margin: 0 0 0.5rem;
  color: #333;
`;

const TemplateDescription = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin: 0 0 1rem;
  min-height: 40px;
`;

const TemplateActions = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  margin: 0 0.25rem;
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

const DeleteButton = styled(Button)`
  background-color: #e74c3c;
  color: white;
  border: none;
  
  &:hover {
    background-color: #c0392b;
  }
`;

const PublicBadge = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(46, 204, 113, 0.8);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const EmptyStateTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
`;

const EmptyStateText = styled.p`
  color: #666;
  margin-bottom: 2rem;
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

const Select = styled.select`
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

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  input {
    width: 18px;
    height: 18px;
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

const CancelButton = styled.button`
  background-color: #f1f1f1;
  color: #333;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #e1e1e1;
  }
`;

const SaveButton = styled.button`
  background-color: #4A90E2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
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

const Templates = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [templateForm, setTemplateForm] = useState({
    name: '',
    description: '',
    category: 'layout',
    isPublic: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { 
    templates, 
    userTemplates, 
    loading, 
    error, 
    refreshTemplates, 
    loadTemplatesByCategory,
    updateTemplate,
    deleteTemplate,
    clearError
  } = useTemplate();
  const navigate = useNavigate();

  // Define template categories
  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'layout', name: 'Layout' },
    { id: 'form', name: 'Form' },
    { id: 'card', name: 'Card' },
    { id: 'navigation', name: 'Navigation' },
    { id: 'custom', name: 'Custom' }
  ];

  // Load templates when category changes
  useEffect(() => {
    if (activeCategory === 'all') {
      refreshTemplates();
    } else {
      loadTemplatesByCategory(activeCategory);
    }
  }, [activeCategory, refreshTemplates, loadTemplatesByCategory]);

  // Filter templates based on active category
  const filteredTemplates = activeCategory === 'all'
    ? [...templates, ...userTemplates]
    : [...templates.filter(t => t.category === activeCategory), 
       ...userTemplates.filter(t => t.category === activeCategory)];

  // Remove duplicates (in case a user's template is also public)
  const uniqueTemplates = filteredTemplates.filter((template, index, self) =>
    index === self.findIndex(t => t._id === template._id)
  );

  const handleOpenModal = (template = null) => {
    if (template) {
      setEditingTemplate(template);
      setTemplateForm({
        name: template.name,
        description: template.description || '',
        category: template.category,
        isPublic: template.isPublic
      });
    } else {
      setEditingTemplate(null);
      setTemplateForm({
        name: '',
        description: '',
        category: 'layout',
        isPublic: false
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTemplate(null);
    clearError();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTemplateForm({
      ...templateForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!templateForm.name) {
      return;
    }
    
    setIsSubmitting(true);
    
    if (editingTemplate) {
      await updateTemplate(editingTemplate._id, templateForm);
    }
    
    setIsSubmitting(false);
    setShowModal(false);
  };

  const handleDeleteTemplate = async (templateId) => {
    if (window.confirm('Are you sure you want to delete this template? This action cannot be undone.')) {
      await deleteTemplate(templateId);
    }
  };

  const handleUseTemplate = (template) => {
    // Navigate to builder with template ID
    navigate(`/builder/new?templateId=${template._id}`);
  };

  if (loading) {
    return (
      <TemplatesContainer>
        <LoadingSpinner>
          <div className="spinner"></div>
        </LoadingSpinner>
      </TemplatesContainer>
    );
  }

  return (
    <TemplatesContainer>
      <Header>
        <Title>Templates</Title>
      </Header>
      
      <CategoryTabs>
        {categories.map(category => (
          <CategoryTab
            key={category.id}
            active={activeCategory === category.id}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </CategoryTab>
        ))}
      </CategoryTabs>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {uniqueTemplates.length === 0 ? (
        <EmptyState>
          <EmptyStateTitle>No Templates Found</EmptyStateTitle>
          <EmptyStateText>
            {activeCategory === 'all' 
              ? 'There are no templates available yet.' 
              : `There are no templates in the ${activeCategory} category.`}
          </EmptyStateText>
        </EmptyState>
      ) : (
        <TemplatesGrid>
          {uniqueTemplates.map(template => (
            <TemplateCard key={template._id}>
              <TemplateImage src={template.thumbnail || 'https://via.placeholder.com/150'}>
                {template.isPublic && <PublicBadge>Public</PublicBadge>}
              </TemplateImage>
              <TemplateInfo>
                <TemplateName>{template.name}</TemplateName>
                <TemplateDescription>
                  {template.description || 'No description provided.'}
                </TemplateDescription>
                <TemplateActions>
                  <PrimaryButton onClick={() => handleUseTemplate(template)}>
                    Use
                  </PrimaryButton>
                  {template.user === userTemplates.find(t => t._id === template._id)?.user && (
                    <>
                      <SecondaryButton onClick={() => handleOpenModal(template)}>
                        Edit
                      </SecondaryButton>
                      <DeleteButton onClick={() => handleDeleteTemplate(template._id)}>
                        Delete
                      </DeleteButton>
                    </>
                  )}
                </TemplateActions>
              </TemplateInfo>
            </TemplateCard>
          ))}
        </TemplatesGrid>
      )}
      
      {showModal && (
        <Modal>
          <ModalContent>
            <ModalTitle>
              {editingTemplate ? 'Edit Template' : 'Create Template'}
            </ModalTitle>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="name">Template Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={templateForm.name}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={templateForm.description}
                  onChange={handleChange}
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="category">Category</Label>
                <Select
                  id="category"
                  name="category"
                  value={templateForm.category}
                  onChange={handleChange}
                >
                  <option value="layout">Layout</option>
                  <option value="form">Form</option>
                  <option value="card">Card</option>
                  <option value="navigation">Navigation</option>
                  <option value="custom">Custom</option>
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Checkbox>
                  <input
                    type="checkbox"
                    id="isPublic"
                    name="isPublic"
                    checked={templateForm.isPublic}
                    onChange={handleChange}
                  />
                  <Label htmlFor="isPublic">Make this template public</Label>
                </Checkbox>
              </FormGroup>
              
              <ModalActions>
                <CancelButton type="button" onClick={handleCloseModal}>
                  Cancel
                </CancelButton>
                <SaveButton type="submit" disabled={isSubmitting || !templateForm.name}>
                  {isSubmitting ? 'Saving...' : 'Save Template'}
                </SaveButton>
              </ModalActions>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </TemplatesContainer>
  );
};

export default Templates;
