import React, { useState } from 'react';
import styled from 'styled-components';
import layoutRegistry from './layouts/LayoutRegistry';

const SelectorContainer = styled.div`
  padding: 1.5rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.text.primary};
`;

const CategoryTabs = styled.div`
  display: flex;
  border-bottom: 1px solid #e9ecef;
  margin-bottom: 1.5rem;
`;

const Tab = styled.div`
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-weight: ${props => (props.active ? '600' : '400')};
  color: ${props => (props.active ? props.theme.colors.primary : props.theme.colors.text.secondary)};
  border-bottom: 2px solid ${props => (props.active ? props.theme.colors.primary : 'transparent')};
  transition: all 0.2s ease;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const TemplatesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const TemplateCard = styled.div`
  border: 2px solid ${props => props.selected ? props.theme.colors.primary : '#e9ecef'};
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  background-color: white;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    border-color: ${props => props.theme.colors.primary};
  }
  
  ${props => props.selected && `
    border-color: ${props.theme.colors.primary};
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    transform: translateY(-5px);
    
    &::after {
      content: '✓';
      position: absolute;
      top: 10px;
      right: 10px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background-color: ${props.theme.colors.primary};
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: bold;
    }
  `}
`;

const TemplatePreview = styled.div`
  height: 150px;
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #e9ecef;
  overflow: hidden;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
  
  i {
    font-size: 2rem;
    color: ${props => props.theme.colors.primary};
  }
`;

const TemplateInfo = styled.div`
  padding: 1rem;
`;

const TemplateName = styled.h3`
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const TemplateDescription = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text.secondary};
  margin: 0;
`;

const TemplateDetailsPanel = styled.div`
  margin-top: 1.5rem;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  display: ${props => props.visible ? 'block' : 'none'};
`;

const TemplateDetailsTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.text.primary};
  display: flex;
  align-items: center;
  
  i {
    margin-right: 0.5rem;
    color: ${props => props.theme.colors.primary};
  }
`;

const TemplateDetailsDescription = styled.p`
  font-size: 1rem;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.text.secondary};
  line-height: 1.5;
`;

const TemplateDetailsList = styled.ul`
  margin-bottom: 1.5rem;
  padding-left: 1.5rem;
  
  li {
    margin-bottom: 0.5rem;
    color: ${props => props.theme.colors.text.secondary};
  }
`;

const TemplatePreviewLarge = styled.div`
  margin-bottom: 1.5rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
  
  img {
    width: 100%;
    display: block;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const CancelButton = styled(Button)`
  background-color: transparent;
  border: 1px solid #ddd;
  color: ${props => props.theme.colors.text.secondary};
  
  &:hover {
    background-color: #f8f9fa;
  }
`;

const SelectButton = styled(Button)`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
  }
  
  &:disabled {
    background-color: #a9a9a9;
    cursor: not-allowed;
  }
`;

const TemplateSelector = ({ onSelect, onCancel }) => {
  const [activeCategory, setActiveCategory] = useState('basic');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  
  // Get unique categories from layout registry
  const categories = [...new Set(Object.values(layoutRegistry).map(layout => layout.category))];
  
  // Filter layouts by active category
  const filteredLayouts = Object.entries(layoutRegistry).filter(
    ([_, layout]) => layout.category === activeCategory
  );
  
  // Get selected template details
  const selectedTemplateDetails = selectedTemplate ? layoutRegistry[selectedTemplate] : null;
  
  const handleSelectTemplate = () => {
    if (selectedTemplate) {
      onSelect(layoutRegistry[selectedTemplate].structure);
    }
  };
  
  // Get template features based on category
  const getTemplateFeatures = (category) => {
    switch(category) {
      case 'basic':
        return ['Simple and clean layout', 'Easy to customize', 'Responsive design'];
      case 'dashboard':
        return ['Fixed sidebar navigation', 'Header with user controls', 'Content cards for data display', 'Responsive design'];
      case 'landing':
        return ['Eye-catching hero section', 'Features showcase', 'Call-to-action buttons', 'Responsive design'];
      case 'form':
        return ['Well-structured form fields', 'Validation-ready inputs', 'Submit button with styling', 'Responsive design'];
      default:
        return ['Responsive design', 'Easy to customize'];
    }
  };
  
  return (
    <SelectorContainer>
      <Title>Choose a Layout Template</Title>
      
      <CategoryTabs>
        {categories.map(category => (
          <Tab
            key={category}
            active={category === activeCategory}
            onClick={() => setActiveCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Tab>
        ))}
      </CategoryTabs>
      
      <TemplatesGrid>
        {filteredLayouts.map(([key, layout]) => (
          <TemplateCard
            key={key}
            selected={key === selectedTemplate}
            onClick={() => setSelectedTemplate(key)}
          >
            <TemplatePreview>
              {layout.image ? (
                <img src={layout.image} alt={layout.name} />
              ) : (
                <i className={`fas fa-${layout.icon}`}></i>
              )}
            </TemplatePreview>
            <TemplateInfo>
              <TemplateName>{layout.name}</TemplateName>
              <TemplateDescription>{layout.description}</TemplateDescription>
            </TemplateInfo>
          </TemplateCard>
        ))}
      </TemplatesGrid>
      
      {selectedTemplateDetails && (
        <TemplateDetailsPanel visible={!!selectedTemplate}>
          <TemplateDetailsTitle>
            <i className={`fas fa-${selectedTemplateDetails.icon}`}></i>
            {selectedTemplateDetails.name}
          </TemplateDetailsTitle>
          
          <TemplatePreviewLarge>
            {selectedTemplateDetails.image ? (
              <img src={selectedTemplateDetails.image} alt={selectedTemplateDetails.name} />
            ) : (
              <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className={`fas fa-${selectedTemplateDetails.icon}`} style={{ fontSize: '3rem', color: '#2962FF' }}></i>
              </div>
            )}
          </TemplatePreviewLarge>
          
          <TemplateDetailsDescription>
            {selectedTemplateDetails.description}
          </TemplateDetailsDescription>
          
          <TemplateDetailsTitle style={{ fontSize: '1rem' }}>
            <i className="fas fa-check-circle"></i>
            Features
          </TemplateDetailsTitle>
          
          <TemplateDetailsList>
            {getTemplateFeatures(selectedTemplateDetails.category).map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </TemplateDetailsList>
        </TemplateDetailsPanel>
      )}
      
      <ActionButtons>
        <CancelButton onClick={onCancel}>Cancel</CancelButton>
        <SelectButton
          onClick={handleSelectTemplate}
          disabled={!selectedTemplate}
        >
          Use Template
        </SelectButton>
      </ActionButtons>
    </SelectorContainer>
  );
};

export default TemplateSelector;
