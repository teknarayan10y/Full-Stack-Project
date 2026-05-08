import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useDrop } from 'react-dnd';
import { useBuilder } from '../../context/BuilderContext';
import CanvasComponent from './CanvasComponent';

const CanvasContainer = styled.div`
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const CanvasHeader = styled.div`
  background-color: #4A90E2;
  color: white;
  padding: 1rem;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PageSelector = styled.select`
  padding: 0.5rem;
  border-radius: 4px;
  border: none;
  font-size: 0.875rem;
`;

const CanvasContent = styled.div`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  position: relative;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 4px;
  }
`;

const DeviceSelector = styled.div`
  display: flex;
  align-items: center;
  margin-left: 1rem;
  
  label {
    margin-right: 0.5rem;
    color: white;
    font-size: 0.875rem;
  }
  
  select {
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    border: none;
    font-size: 0.875rem;
  }
`;

const DropArea = styled.div`
  min-height: 100%;
  background-color: white;
  border-radius: 8px;
  padding: 1rem;
  position: relative;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  width: ${props => props.deviceType === 'desktop' ? '100%' : 
    props.deviceType === 'tablet' ? '768px' : '375px'};
  height: ${props => props.deviceType === 'desktop' ? '100%' : 
    props.deviceType === 'tablet' ? '1024px' : '667px'};
  margin: 0 auto;
  overflow: auto;
  transition: all 0.3s ease;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #999;
  text-align: center;
  border: 2px dashed #ddd;
  border-radius: 8px;
  margin: 1rem;
`;

const EmptyStateText = styled.p`
  margin-bottom: 0;
`;

const Canvas = () => {
  const { 
    getCurrentPage, 
    addComponent, 
    selectedPageIndex, 
    changePage,
    selectedComponent,
    selectComponent,
    deselectComponent,
    currentProject
  } = useBuilder();
  
  const [deviceType, setDeviceType] = React.useState('desktop');
  
  const currentPage = getCurrentPage();
  console.log('Current page in Canvas:', currentPage);

  // Set up drop target
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'component',
    drop: (item, monitor) => {
      console.log('Item dropped:', item); // Debug log
      
      const offset = monitor.getClientOffset();
      if (!offset) {
        console.error('No offset available');
        return;
      }
      
      const canvasElement = document.getElementById('canvas-drop-area');
      if (!canvasElement) {
        console.error('Canvas element not found');
        return;
      }
      
      const canvasRect = canvasElement.getBoundingClientRect();
      
      // Calculate position relative to the canvas
      const position = {
        x: offset.x - canvasRect.left,
        y: offset.y - canvasRect.top
      };
      
      console.log('Dropping at position:', position);
      
      // Add the component to the canvas
      addComponent(
        item.component.type || item.component.name,
        item.component,
        position
      );
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }));

  // Handle page change
  const handlePageChange = (e) => {
    changePage(parseInt(e.target.value));
  };

  // Handle canvas click (deselect component)
  const handleCanvasClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      deselectComponent();
    }
  }, [deselectComponent]);

  return (
    <CanvasContainer>
      <CanvasHeader>
        <span>Canvas</span>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <DeviceSelector>
            <label>Device:</label>
            <select value={deviceType} onChange={(e) => setDeviceType(e.target.value)}>
              <option value="desktop">Desktop</option>
              <option value="tablet">Tablet</option>
              <option value="mobile">Mobile</option>
            </select>
          </DeviceSelector>
          
          {currentPage && (
            <PageSelector value={selectedPageIndex} onChange={handlePageChange}>
              {currentProject && currentProject.pages && currentProject.pages.map((page, index) => (
                <option key={index} value={index}>
                  {page.name}
                </option>
              ))}
            </PageSelector>
          )}
        </div>
      </CanvasHeader>
      
      <CanvasContent>
        <DropArea
          ref={drop}
          id="canvas-drop-area"
          deviceType={deviceType}
          onClick={handleCanvasClick}
          style={{
            backgroundColor: isOver ? '#f0f7ff' : 'white',
            transition: 'background-color 0.2s ease',
            border: isOver ? '2px dashed #2962FF' : '2px dashed #e9ecef',
            minHeight: '300px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Debug information */}
          <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '10px', color: '#999' }}>
            {currentPage ? `Page: ${currentPage.name || 'Unnamed'}` : 'No page'}
            {currentPage && currentPage.components ? ` | Components: ${currentPage.components.length}` : ' | No components'}
          </div>
          {/* Check if we have components to render */}
          {currentPage && Array.isArray(currentPage.components) && currentPage.components.length > 0 ? (
            currentPage.components.map(component => (
              <CanvasComponent
                key={component.id}
                component={component}
                isSelected={selectedComponent && selectedComponent.id === component.id}
                onSelect={() => selectComponent(component)}
              />
            ))
          ) : (
            <EmptyState>
              <EmptyStateText>
                Drag and drop components here to build your app
              </EmptyStateText>
            </EmptyState>
          )}
        </DropArea>
      </CanvasContent>
    </CanvasContainer>
  );
};

export default Canvas;
