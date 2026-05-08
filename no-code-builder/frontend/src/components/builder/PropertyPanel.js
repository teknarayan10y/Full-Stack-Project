import React, { useState, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { useBuilder } from '../../context/BuilderContext';

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
  display: flex;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #eee;
  background-color: #f9f9f9;
`;

const ApplyAllButton = styled.button`
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  margin: 10px auto;
  display: block;
  cursor: pointer;
  font-weight: bold;
  &:hover {
    background-color: #45a049;
  }
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #eee;
`;

const Tab = styled.button`
  padding: 0.75rem 1rem;
  background-color: ${props => props.active ? '#f5f5f5' : 'transparent'};
  border: none;
  border-bottom: 2px solid ${props => props.active ? '#4A90E2' : 'transparent'};
  color: ${props => props.active ? '#4A90E2' : '#666'};
  font-weight: ${props => props.active ? '500' : 'normal'};
  cursor: pointer;
  flex: 1;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const PanelContent = styled.div`
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

const PropertyGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const PropertyGroupTitle = styled.h3`
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const PropertyItem = styled.div`
  margin-bottom: 1rem;
`;

const PropertyLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  color: #333;
`;

const PropertyInput = styled.input`
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #4A90E2;
  }
`;

const PropertyInputGroup = styled.div`
  display: flex;
  width: 100%;
`;

const ApplyButton = styled.button`
  background-color: #4A90E2;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  padding: 0 8px;
  margin-left: -1px;
  cursor: pointer;
  &:hover {
    background-color: #3A80D2;
  }
`;

const PropertySelect = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #4A90E2;
  }
`;

const PropertyTextarea = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.875rem;
  resize: vertical;
  min-height: 80px;
  
  &:focus {
    outline: none;
    border-color: #4A90E2;
  }
`;

const ColorInput = styled.div`
  display: flex;
  align-items: center;
  
  input[type="color"] {
    width: 40px;
    height: 40px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-right: 0.5rem;
    padding: 2px;
    
    &::-webkit-color-swatch-wrapper {
      padding: 0;
    }
    
    &::-webkit-color-swatch {
      border: none;
      border-radius: 2px;
    }
  }
  
  input[type="text"] {
    flex: 1;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #999;
  text-align: center;
  height: 100%;
`;

const PropertyPanel = () => {
  const [activeTab, setActiveTab] = useState('props');
  const { selectedComponent, updateComponentProps, updateComponentStyle } = useBuilder();
  const [localProps, setLocalProps] = useState({});
  const [localStyles, setLocalStyles] = useState({});
  const timeoutRef = useRef(null);

  // Initialize local state when selected component changes
  React.useEffect(() => {
    if (selectedComponent) {
      setLocalProps(selectedComponent.props || {});
      setLocalStyles(selectedComponent.style || {});
    }
  }, [selectedComponent]);

  // Debounce function to delay updates
  const debounce = (callback, delay = 500) => {
    return (...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    };
  };

  // Only update local state, no auto-refresh
  const handlePropChange = (propName, value) => {
    if (!selectedComponent) return;
    
    // Only update local state, don't update the actual component yet
    setLocalProps(prev => ({
      ...prev,
      [propName]: value
    }));
  };

  // Only update local state, no auto-refresh
  const handleStyleChange = (styleName, value) => {
    if (!selectedComponent) return;
    
    // Only update local state, don't update the actual component yet
    setLocalStyles(prev => ({
      ...prev,
      [styleName]: value
    }));
  };
  
  // Apply changes to the actual component
  const applyChanges = (propName, value) => {
    if (!selectedComponent) return;
    
    // Update the actual component with the current value
    updateComponentProps(selectedComponent.id, {
      [propName]: value
    });
  };
  
  // Apply style changes to the actual component
  const applyStyleChanges = (styleName, value) => {
    if (!selectedComponent) return;
    
    // Update the actual component with the current value
    updateComponentStyle(selectedComponent.id, {
      [styleName]: value
    });
  };
  
  // Apply all pending changes
  const applyAllChanges = () => {
    if (!selectedComponent) return;
    
    // Update all props at once
    updateComponentProps(selectedComponent.id, localProps);
    
    // Update all styles at once
    updateComponentStyle(selectedComponent.id, localStyles);
  };

  // Render properties based on component type
  const renderProperties = () => {
    if (!selectedComponent) return null;
    
    const { type } = selectedComponent;
    // Use local props for immediate UI updates
    const props = localProps;
    
    switch (type) {
      case 'Container':
        return (
          <PropertyGroup>
            <PropertyGroupTitle>Container Properties</PropertyGroupTitle>
            <PropertyItem>
              <PropertyLabel>Text</PropertyLabel>
              <PropertyInput
                type="text"
                value={props.text || ''}
                onChange={(e) => handlePropChange('text', e.target.value)}
              />
            </PropertyItem>
          </PropertyGroup>
        );
        
      case 'Text':
        return (
          <PropertyGroup>
            <PropertyGroupTitle>Text Properties</PropertyGroupTitle>
            <PropertyItem>
              <PropertyLabel>Content</PropertyLabel>
              <PropertyTextarea
                value={props.text || ''}
                onChange={(e) => handlePropChange('text', e.target.value)}
              />
            </PropertyItem>
            <PropertyItem>
              <PropertyLabel>Tag</PropertyLabel>
              <PropertySelect
                value={props.tag || 'p'}
                onChange={(e) => handlePropChange('tag', e.target.value)}
              >
                <option value="p">Paragraph</option>
                <option value="span">Span</option>
                <option value="div">Div</option>
              </PropertySelect>
            </PropertyItem>
          </PropertyGroup>
        );
        
      case 'Heading':
        return (
          <PropertyGroup>
            <PropertyGroupTitle>Heading Properties</PropertyGroupTitle>
            <PropertyItem>
              <PropertyLabel>Text</PropertyLabel>
              <PropertyInput
                type="text"
                value={props.text || ''}
                onChange={(e) => handlePropChange('text', e.target.value)}
              />
            </PropertyItem>
            <PropertyItem>
              <PropertyLabel>Level</PropertyLabel>
              <PropertySelect
                value={props.level || 'h2'}
                onChange={(e) => handlePropChange('level', e.target.value)}
              >
                <option value="h1">H1</option>
                <option value="h2">H2</option>
                <option value="h3">H3</option>
                <option value="h4">H4</option>
                <option value="h5">H5</option>
                <option value="h6">H6</option>
              </PropertySelect>
            </PropertyItem>
          </PropertyGroup>
        );
        
      case 'Button':
        return (
          <PropertyGroup>
            <PropertyGroupTitle>Button Properties</PropertyGroupTitle>
            <PropertyItem>
              <PropertyLabel>Text</PropertyLabel>
              <PropertyInput
                type="text"
                value={props.text || ''}
                onChange={(e) => handlePropChange('text', e.target.value)}
              />
            </PropertyItem>
            <PropertyItem>
              <PropertyLabel>Type</PropertyLabel>
              <PropertySelect
                value={props.type || 'button'}
                onChange={(e) => handlePropChange('type', e.target.value)}
              >
                <option value="button">Button</option>
                <option value="submit">Submit</option>
                <option value="reset">Reset</option>
              </PropertySelect>
            </PropertyItem>
          </PropertyGroup>
        );
        
      case 'Image':
        return (
          <>
            <PropertyGroup>
              <PropertyGroupTitle>Image Properties</PropertyGroupTitle>
              <PropertyItem>
                <PropertyLabel>Source URL</PropertyLabel>
                <PropertyInputGroup>
                  <PropertyInput
                    type="text"
                    value={props.src || ''}
                    onChange={(e) => handlePropChange('src', e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && applyChanges('src', props.src)}
                  />
                  <ApplyButton onClick={() => applyChanges('src', props.src)}>Apply</ApplyButton>
                </PropertyInputGroup>
              </PropertyItem>
              <PropertyItem>
                <PropertyLabel>Alt Text</PropertyLabel>
                <PropertyInputGroup>
                  <PropertyInput
                    type="text"
                    value={props.alt || ''}
                    onChange={(e) => handlePropChange('alt', e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && applyChanges('alt', props.alt)}
                  />
                  <ApplyButton onClick={() => applyChanges('alt', props.alt)}>Apply</ApplyButton>
                </PropertyInputGroup>
              </PropertyItem>
              <PropertyItem>
                <PropertyLabel>Caption</PropertyLabel>
                <PropertyInput
                  type="text"
                  value={props.caption || ''}
                  onChange={(e) => handlePropChange('caption', e.target.value)}
                />
              </PropertyItem>
              <PropertyItem>
                <PropertyLabel>Caption Position</PropertyLabel>
                <PropertySelect
                  value={props.captionPosition || 'below'}
                  onChange={(e) => handlePropChange('captionPosition', e.target.value)}
                >
                  <option value="below">Below</option>
                  <option value="above">Above</option>
                  <option value="overlay">Overlay</option>
                </PropertySelect>
              </PropertyItem>
            </PropertyGroup>
            <PropertyGroup>
              <PropertyGroupTitle>Image Style</PropertyGroupTitle>
              <PropertyItem>
                <PropertyLabel>Width</PropertyLabel>
                <PropertyInput
                  type="text"
                  value={props.width || ''}
                  onChange={(e) => handlePropChange('width', e.target.value)}
                  placeholder="e.g. 100%, 300px"
                />
              </PropertyItem>
              <PropertyItem>
                <PropertyLabel>Height</PropertyLabel>
                <PropertyInput
                  type="text"
                  value={props.height || ''}
                  onChange={(e) => handlePropChange('height', e.target.value)}
                  placeholder="e.g. auto, 200px"
                />
              </PropertyItem>
              <PropertyItem>
                <PropertyLabel>Object Fit</PropertyLabel>
                <PropertySelect
                  value={props.objectFit || 'cover'}
                  onChange={(e) => handlePropChange('objectFit', e.target.value)}
                >
                  <option value="cover">Cover</option>
                  <option value="contain">Contain</option>
                  <option value="fill">Fill</option>
                  <option value="none">None</option>
                  <option value="scale-down">Scale Down</option>
                </PropertySelect>
              </PropertyItem>
              <PropertyItem>
                <PropertyLabel>Border Radius</PropertyLabel>
                <PropertyInput
                  type="text"
                  value={props.borderRadius || ''}
                  onChange={(e) => handlePropChange('borderRadius', e.target.value)}
                  placeholder="e.g. 4px, 50%"
                />
              </PropertyItem>
              <PropertyItem>
                <PropertyLabel>Box Shadow</PropertyLabel>
                <PropertyInput
                  type="text"
                  value={props.boxShadow || ''}
                  onChange={(e) => handlePropChange('boxShadow', e.target.value)}
                  placeholder="e.g. 0 2px 4px rgba(0,0,0,0.1)"
                />
              </PropertyItem>
            </PropertyGroup>
          </>
        );
        
      case 'TextInput':
        return (
          <PropertyGroup>
            <PropertyGroupTitle>Input Properties</PropertyGroupTitle>
            <PropertyItem>
              <PropertyLabel>Label</PropertyLabel>
              <PropertyInput
                type="text"
                value={props.label || ''}
                onChange={(e) => handlePropChange('label', e.target.value)}
              />
            </PropertyItem>
            <PropertyItem>
              <PropertyLabel>Placeholder</PropertyLabel>
              <PropertyInput
                type="text"
                value={props.placeholder || ''}
                onChange={(e) => handlePropChange('placeholder', e.target.value)}
              />
            </PropertyItem>
            <PropertyItem>
              <PropertyLabel>Type</PropertyLabel>
              <PropertySelect
                value={props.type || 'text'}
                onChange={(e) => handlePropChange('type', e.target.value)}
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="password">Password</option>
                <option value="number">Number</option>
                <option value="tel">Telephone</option>
              </PropertySelect>
            </PropertyItem>
            <PropertyItem>
              <PropertyLabel>Required</PropertyLabel>
              <PropertySelect
                value={props.required ? 'true' : 'false'}
                onChange={(e) => handlePropChange('required', e.target.value === 'true')}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </PropertySelect>
            </PropertyItem>
          </PropertyGroup>
        );
        
      default:
        return (
          <PropertyGroup>
            <PropertyGroupTitle>Basic Properties</PropertyGroupTitle>
            <PropertyItem>
              <PropertyLabel>Component Type</PropertyLabel>
              <PropertyInput
                type="text"
                value={type}
                readOnly
              />
            </PropertyItem>
          </PropertyGroup>
        );
    }
  };

  // Render style properties
  const renderStyles = () => {
    if (!selectedComponent) return null;
    
    // Use local styles for immediate UI updates
    const style = localStyles;
    
    return (
      <>
        <PropertyGroup>
          <PropertyGroupTitle>Dimensions</PropertyGroupTitle>
          <PropertyItem>
            <PropertyLabel>Width</PropertyLabel>
            <PropertyInput
              type="text"
              value={style.width || ''}
              onChange={(e) => handleStyleChange('width', e.target.value)}
              placeholder="e.g. 100px, 50%, auto"
            />
          </PropertyItem>
          <PropertyItem>
            <PropertyLabel>Height</PropertyLabel>
            <PropertyInput
              type="text"
              value={style.height || ''}
              onChange={(e) => handleStyleChange('height', e.target.value)}
              placeholder="e.g. 100px, 50%, auto"
            />
          </PropertyItem>
        </PropertyGroup>
        
        <PropertyGroup>
          <PropertyGroupTitle>Spacing</PropertyGroupTitle>
          <PropertyItem>
            <PropertyLabel>Padding</PropertyLabel>
            <PropertyInput
              type="text"
              value={style.padding || ''}
              onChange={(e) => handleStyleChange('padding', e.target.value)}
              placeholder="e.g. 10px, 10px 20px"
            />
          </PropertyItem>
          <PropertyItem>
            <PropertyLabel>Margin</PropertyLabel>
            <PropertyInput
              type="text"
              value={style.margin || ''}
              onChange={(e) => handleStyleChange('margin', e.target.value)}
              placeholder="e.g. 10px, 10px 20px"
            />
          </PropertyItem>
        </PropertyGroup>
        
        <PropertyGroup>
          <PropertyGroupTitle>Typography</PropertyGroupTitle>
          <PropertyItem>
            <PropertyLabel>Font Size</PropertyLabel>
            <PropertyInput
              type="text"
              value={style.fontSize || ''}
              onChange={(e) => handleStyleChange('fontSize', e.target.value)}
              placeholder="e.g. 16px, 1.2rem"
            />
          </PropertyItem>
          <PropertyItem>
            <PropertyLabel>Font Weight</PropertyLabel>
            <PropertySelect
              value={style.fontWeight || ''}
              onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
            >
              <option value="">Default</option>
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
              <option value="300">Light (300)</option>
              <option value="400">Regular (400)</option>
              <option value="500">Medium (500)</option>
              <option value="600">Semi-Bold (600)</option>
              <option value="700">Bold (700)</option>
            </PropertySelect>
          </PropertyItem>
          <PropertyItem>
            <PropertyLabel>Text Align</PropertyLabel>
            <PropertySelect
              value={style.textAlign || ''}
              onChange={(e) => handleStyleChange('textAlign', e.target.value)}
            >
              <option value="">Default</option>
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
              <option value="justify">Justify</option>
            </PropertySelect>
          </PropertyItem>
        </PropertyGroup>
        
        <PropertyGroup>
          <PropertyGroupTitle>Colors</PropertyGroupTitle>
          <PropertyItem>
            <PropertyLabel>Background Color</PropertyLabel>
            <ColorInput>
              <input
                type="color"
                value={style.backgroundColor || '#ffffff'}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
              />
              <PropertyInput
                type="text"
                value={style.backgroundColor || ''}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                placeholder="#ffffff or rgba(255,255,255,1)"
              />
            </ColorInput>
          </PropertyItem>
          <PropertyItem>
            <PropertyLabel>Text Color</PropertyLabel>
            <ColorInput>
              <input
                type="color"
                value={style.color || '#000000'}
                onChange={(e) => handleStyleChange('color', e.target.value)}
              />
              <PropertyInput
                type="text"
                value={style.color || ''}
                onChange={(e) => handleStyleChange('color', e.target.value)}
                placeholder="#000000 or rgba(0,0,0,1)"
              />
            </ColorInput>
          </PropertyItem>
        </PropertyGroup>
        
        <PropertyGroup>
          <PropertyGroupTitle>Border</PropertyGroupTitle>
          <PropertyItem>
            <PropertyLabel>Border Width</PropertyLabel>
            <PropertyInput
              type="text"
              value={style.borderWidth || ''}
              onChange={(e) => handleStyleChange('borderWidth', e.target.value)}
              placeholder="e.g. 1px"
            />
          </PropertyItem>
          <PropertyItem>
            <PropertyLabel>Border Style</PropertyLabel>
            <PropertySelect
              value={style.borderStyle || ''}
              onChange={(e) => handleStyleChange('borderStyle', e.target.value)}
            >
              <option value="">None</option>
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
              <option value="double">Double</option>
            </PropertySelect>
          </PropertyItem>
          <PropertyItem>
            <PropertyLabel>Border Color</PropertyLabel>
            <ColorInput>
              <input
                type="color"
                value={style.borderColor || '#000000'}
                onChange={(e) => handleStyleChange('borderColor', e.target.value)}
              />
              <PropertyInput
                type="text"
                value={style.borderColor || ''}
                onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                placeholder="#000000"
              />
            </ColorInput>
          </PropertyItem>
          <PropertyItem>
            <PropertyLabel>Border Radius</PropertyLabel>
            <PropertyInput
              type="text"
              value={style.borderRadius || ''}
              onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
              placeholder="e.g. 4px, 50%"
            />
          </PropertyItem>
        </PropertyGroup>
      </>
    );
  };

  return (
    <PanelContainer>
      <PanelHeader>Properties</PanelHeader>
      
      {selectedComponent ? (
        <>
          <ApplyAllButton onClick={applyAllChanges}>
            Apply All Changes
          </ApplyAllButton>
          
          <TabContainer>
            <Tab
              active={activeTab === 'props'}
              onClick={() => setActiveTab('props')}
            >
              Properties
            </Tab>
            <Tab
              active={activeTab === 'styles'}
              onClick={() => setActiveTab('styles')}
            >
              Styles
            </Tab>
          </TabContainer>
          
          <PanelContent>
            {activeTab === 'props' ? renderProperties() : renderStyles()}
          </PanelContent>
        </>
      ) : (
        <EmptyState>
          Select a component to edit its properties
        </EmptyState>
      )}
    </PanelContainer>
  );
};

export default PropertyPanel;
