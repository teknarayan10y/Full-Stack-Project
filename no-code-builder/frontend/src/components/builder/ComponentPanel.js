import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDrag } from 'react-dnd';
import { useComponent } from '../../context/ComponentContext';
import componentRegistry from './ComponentRegistry';

const PanelContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const PanelHeader = styled.div`
  background-color: #4A90E2;
  color: white;
  padding: 1rem;
  font-weight: 500;
`;

const CategoryTabs = styled.div`
  display: flex;
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
  padding: 0.75rem 1rem;
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

const ComponentsContainer = styled.div`
  padding: 1rem;
  overflow-y: auto;
  flex: 1;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 4px;
  }
`;

const ComponentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const ComponentItem = styled.div`
  background-color: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 1rem;
  cursor: grab;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: #f0f0f0;
    transform: translateY(-2px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  }
`;

const ComponentIcon = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4A90E2;
`;

const ComponentName = styled.div`
  font-size: 0.875rem;
  text-align: center;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #999;
  text-align: center;
`;

const DraggableComponent = ({ component }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'component',
    item: () => {
      console.log('Begin dragging component:', component.name);
      return { component };
    },
    end: (item, monitor) => {
      const didDrop = monitor.didDrop();
      console.log('End dragging, did drop:', didDrop);
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }));

  return (
    <ComponentItem
      ref={drag}
      style={{ 
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab'
      }}
      onClick={() => console.log('Component clicked:', component.name)}
    >
      <ComponentIcon>
        <i className={`icon-${component.icon || 'box'}`}></i>
      </ComponentIcon>
      <ComponentName>{component.name}</ComponentName>
    </ComponentItem>
  );
};

const ComponentPanel = () => {
  const [activeCategory, setActiveCategory] = useState('layout');
  const [categoryComponents, setCategoryComponents] = useState([]);
  const { components, loading, loadComponentsByCategory } = useComponent();

  // Define component categories
  const categories = [
    { id: 'layout', name: 'Layout' },
    { id: 'basic', name: 'Basic' },
    { id: 'form', name: 'Form' },
    { id: 'media', name: 'Media' },
    { id: 'custom', name: 'Custom' }
  ];

  // Load components for the active category
  useEffect(() => {
    // First check if we have registry components for this category
    const registryComponents = Object.entries(componentRegistry)
      .filter(([_, config]) => config.category === activeCategory)
      .map(([key, config]) => ({
        _id: key,
        name: config.name,
        type: key,
        category: config.category,
        icon: config.icon,
        description: config.description,
        defaultProps: config.defaultProps,
        defaultStyle: config.defaultProps?.style || {}
      }));
      
    if (registryComponents.length > 0) {
      setCategoryComponents(registryComponents);
    } else {
      // Fall back to API components if no registry components for this category
      loadComponentsByCategory(activeCategory);
    }
  }, [activeCategory, loadComponentsByCategory]);

  // Set category components when components change (for API-loaded components)
  useEffect(() => {
    if (components.length > 0 && !categoryComponents.length) {
      setCategoryComponents(components);
    }
  }, [components, categoryComponents.length]);

  return (
    <PanelContainer>
      <PanelHeader>Components</PanelHeader>
      
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
      
      <ComponentsContainer>
        {loading ? (
          <EmptyState>Loading components...</EmptyState>
        ) : categoryComponents.length === 0 ? (
          <EmptyState>
            No components found in this category.
          </EmptyState>
        ) : (
          <ComponentsGrid>
            {categoryComponents.map(component => (
              <DraggableComponent key={component._id} component={component} />
            ))}
          </ComponentsGrid>
        )}
      </ComponentsContainer>
    </PanelContainer>
  );
};

export default ComponentPanel;
