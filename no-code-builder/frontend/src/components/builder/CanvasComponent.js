import React, { useRef } from 'react';
import styled from 'styled-components';
import { useDrag, useDrop } from 'react-dnd';
import { useBuilder } from '../../context/BuilderContext';

const ComponentWrapper = styled.div`
  position: absolute;
  cursor: move;
  user-select: none;
  border: 2px solid ${props => props.isSelected ? '#4A90E2' : 'transparent'};
  border-radius: 4px;
  transition: border-color 0.2s ease;
  
  &:hover {
    border-color: ${props => props.isSelected ? '#4A90E2' : '#ddd'};
  }
`;

const ComponentContent = styled.div`
  position: relative;
`;

const ComponentControls = styled.div`
  position: absolute;
  top: -30px;
  right: 0;
  display: flex;
  gap: 5px;
  opacity: ${props => props.isSelected ? 1 : 0};
  transition: opacity 0.2s ease;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 2px;
  
  ${ComponentWrapper}:hover & {
    opacity: 1;
  }
`;

const ControlButton = styled.button`
  background-color: transparent;
  border: none;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #666;
  border-radius: 4px;
  
  &:hover {
    background-color: #f5f5f5;
    color: #333;
  }
`;

const DeleteButton = styled(ControlButton)`
  &:hover {
    background-color: #ffebee;
    color: #e53935;
  }
`;

// Component renderer based on type
const ComponentRenderer = ({ component }) => {
  const { type, props = {}, style = {}, children } = component || {};
  
  // Default styles
  const defaultStyle = {
    padding: '10px',
    minWidth: '50px',
    minHeight: '20px',
    ...style
  };
  
  // Render based on component type
  switch (type) {
    case 'Container':
      return (
        <div style={{ ...defaultStyle, backgroundColor: style?.backgroundColor || '#ffffff' }}>
          {props?.text || 'Container'}
          {children && children.map(child => (
            <ComponentRenderer key={child.id} component={child} />
          ))}
        </div>
      );
      
    case 'Row':
      return (
        <div style={{ 
          ...defaultStyle, 
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: style?.gap || '10px'
        }}>
          {props?.text || 'Row'}
          {children && children.map(child => (
            <ComponentRenderer key={child.id} component={child} />
          ))}
        </div>
      );
      
    case 'Column':
      return (
        <div style={{ 
          ...defaultStyle, 
          display: 'flex',
          flexDirection: 'column',
          gap: style?.gap || '10px'
        }}>
          {props?.text || 'Column'}
          {children && children.map(child => (
            <ComponentRenderer key={child.id} component={child} />
          ))}
        </div>
      );
      
    case 'Text':
      return (
        <p style={defaultStyle}>
          {props?.text || 'Text component'}
        </p>
      );
      
    case 'Heading':
      const HeadingTag = `h${props?.level || 2}`;
      return (
        <HeadingTag style={defaultStyle}>
          {props?.text || 'Heading'}
        </HeadingTag>
      );
      
    case 'Button':
      return (
        <button 
          style={{
            ...defaultStyle,
            backgroundColor: style?.backgroundColor || '#4A90E2',
            color: style?.color || 'white',
            border: style?.border || 'none',
            borderRadius: style?.borderRadius || '4px',
            cursor: 'default' // Prevent cursor change in builder
          }}
        >
          {props?.text || 'Button'}
        </button>
      );
      
    case 'Image':
      return (
        <div style={defaultStyle}>
          <img 
            src={props?.src || 'https://via.placeholder.com/150'} 
            alt={props?.alt || 'Image'} 
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'cover'
            }}
          />
        </div>
      );
      
    case 'TextInput':
      return (
        <div style={defaultStyle}>
          {props?.label && (
            <label style={{ display: 'block', marginBottom: '5px' }}>
              {props.label}
            </label>
          )}
          <input
            type={props?.type || 'text'}
            placeholder={props?.placeholder || 'Enter text...'}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
            readOnly // Prevent interaction in builder
          />
        </div>
      );
      
    case 'Card':
      return (
        <div style={{
          ...defaultStyle,
          backgroundColor: style?.backgroundColor || '#ffffff',
          borderRadius: style?.borderRadius || '8px',
          boxShadow: style?.boxShadow || '0 2px 5px rgba(0,0,0,0.1)'
        }}>
          {props?.title && (
            <div style={{ 
              fontWeight: 'bold', 
              marginBottom: '10px',
              fontSize: '1.1em'
            }}>
              {props.title}
            </div>
          )}
          {props?.text || 'Card content'}
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

const CanvasComponent = ({ component, isSelected, onSelect }) => {
  const { deleteComponent, updateComponentPosition } = useBuilder();
  const ref = useRef(null);
  
  // Set up drag
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'canvas-component',
    item: { id: component.id, type: component.type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }));
  
  // Set up drop for nested components
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'component',
    drop: (item, monitor) => {
      // Handle dropping a component onto this component
      // This would be for nested components
      console.log('Dropped onto component:', component.id, item);
      // Prevent event bubbling
      return { handled: true };
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }));
  
  // Combine drag and drop refs
  drag(drop(ref));
  
  // Handle component click
  const handleClick = (e) => {
    e.stopPropagation();
    onSelect();
  };
  
  // Handle delete
  const handleDelete = (e) => {
    e.stopPropagation();
    deleteComponent(component.id);
  };
  
  return (
    <ComponentWrapper
      ref={ref}
      isSelected={isSelected}
      onClick={handleClick}
      style={{
        left: component.position?.x || 0,
        top: component.position?.y || 0,
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: isOver ? '#f0f7ff' : 'transparent'
      }}
    >
      <ComponentControls isSelected={isSelected}>
        <DeleteButton onClick={handleDelete}>
          <i className="icon-trash"></i>
        </DeleteButton>
      </ComponentControls>
      
      <ComponentContent>
        <ComponentRenderer component={component} />
      </ComponentContent>
    </ComponentWrapper>
  );
};

export default CanvasComponent;
