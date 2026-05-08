import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  body {
    font-family: ${props => props.theme.typography.fontFamily};
    font-size: ${props => props.theme.typography.fontSize}px;
    background-color: ${props => props.theme.colors.background.default};
    color: ${props => props.theme.colors.text.primary};
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  h1, h2, h3, h4, h5, h6 {
    margin-bottom: 1rem;
    font-weight: 600;
    line-height: 1.3;
    color: ${props => props.theme.colors.text.primary};
  }
  
  h1 {
    font-size: ${props => props.theme.typography.h1.fontSize};
    font-weight: ${props => props.theme.typography.h1.fontWeight};
    line-height: ${props => props.theme.typography.h1.lineHeight};
  }
  
  h2 {
    font-size: ${props => props.theme.typography.h2.fontSize};
    font-weight: ${props => props.theme.typography.h2.fontWeight};
    line-height: ${props => props.theme.typography.h2.lineHeight};
  }
  
  h3 {
    font-size: ${props => props.theme.typography.h3.fontSize};
    font-weight: ${props => props.theme.typography.h3.fontWeight};
    line-height: ${props => props.theme.typography.h3.lineHeight};
  }
  
  h4 {
    font-size: ${props => props.theme.typography.h4.fontSize};
    font-weight: ${props => props.theme.typography.h4.fontWeight};
    line-height: ${props => props.theme.typography.h4.lineHeight};
  }
  
  h5 {
    font-size: ${props => props.theme.typography.h5.fontSize};
    font-weight: ${props => props.theme.typography.h5.fontWeight};
    line-height: ${props => props.theme.typography.h5.lineHeight};
  }
  
  h6 {
    font-size: ${props => props.theme.typography.h6.fontSize};
    font-weight: ${props => props.theme.typography.h6.fontWeight};
    line-height: ${props => props.theme.typography.h6.lineHeight};
  }
  
  p {
    margin-bottom: 1rem;
  }
  
  a {
    color: ${props => props.theme.colors.primary.main};
    text-decoration: none;
    transition: color 0.3s ease;
    
    &:hover {
      color: ${props => props.theme.colors.primary.dark};
    }
  }
  
  button {
    cursor: pointer;
    font-family: ${props => props.theme.typography.fontFamily};
  }
  
  input, textarea, select {
    font-family: ${props => props.theme.typography.fontFamily};
  }
  
  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.background.default};
  }
  
  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary.light};
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.primary.main};
  }
  
  /* Selection */
  ::selection {
    background-color: ${props => props.theme.colors.primary.main};
    color: white;
  }
`;

export default GlobalStyles;
