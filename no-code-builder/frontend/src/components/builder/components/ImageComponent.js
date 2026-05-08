import React from 'react';
import styled from 'styled-components';

const ImageContainer = styled.div`
  position: relative;
  width: ${props => props.width || '100%'};
  height: ${props => props.height || 'auto'};
  overflow: hidden;
  border-radius: ${props => props.borderRadius || '0'};
  box-shadow: ${props => props.boxShadow || 'none'};
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: ${props => props.objectFit || 'cover'};
  transition: transform 0.3s ease;
  
  ${props => props.hoverEffect && `
    &:hover {
      transform: scale(1.05);
    }
  `}
`;

const Caption = styled.div`
  position: ${props => props.captionPosition === 'overlay' ? 'absolute' : 'relative'};
  bottom: ${props => props.captionPosition === 'overlay' ? '0' : 'auto'};
  left: 0;
  width: 100%;
  padding: 0.5rem;
  background-color: ${props => props.captionPosition === 'overlay' ? 'rgba(0, 0, 0, 0.6)' : 'transparent'};
  color: ${props => props.captionPosition === 'overlay' ? 'white' : props.captionColor || '#333'};
  text-align: ${props => props.captionAlignment || 'center'};
  font-size: ${props => props.captionSize || '0.875rem'};
`;

const ImageComponent = ({ 
  src,
  alt,
  width,
  height,
  objectFit,
  borderRadius,
  boxShadow,
  hoverEffect,
  caption,
  captionPosition,
  captionAlignment,
  captionColor,
  captionSize,
  onClick
}) => {
  return (
    <ImageContainer 
      width={width} 
      height={height}
      borderRadius={borderRadius}
      boxShadow={boxShadow}
      onClick={onClick}
    >
      <StyledImage 
        src={src} 
        alt={alt || 'Image'} 
        objectFit={objectFit}
        hoverEffect={hoverEffect}
      />
      
      {caption && (
        <Caption 
          captionPosition={captionPosition}
          captionAlignment={captionAlignment}
          captionColor={captionColor}
          captionSize={captionSize}
        >
          {caption}
        </Caption>
      )}
    </ImageContainer>
  );
};

export default ImageComponent;
