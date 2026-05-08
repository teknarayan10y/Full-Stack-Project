// theme.js - Modern UI theme with red and blue color combination

const theme = {
  // Primary colors
  colors: {
    primary: {
      main: '#2962FF',      // Vibrant blue
      light: '#768FFF',
      dark: '#0039CB',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#F50057',      // Vibrant red
      light: '#FF5983',
      dark: '#BB002F',
      contrastText: '#FFFFFF'
    },
    // Gradient combinations
    gradients: {
      blueToRed: 'linear-gradient(45deg, #2962FF 0%, #F50057 100%)',
      redToBlue: 'linear-gradient(45deg, #F50057 0%, #2962FF 100%)',
      primaryLight: 'linear-gradient(45deg, #768FFF 0%, #FF5983 100%)',
      primaryDark: 'linear-gradient(45deg, #0039CB 0%, #BB002F 100%)'
    },
    // UI colors
    background: {
      default: '#F5F7FA',
      paper: '#FFFFFF',
      dark: '#1A1A2E'
    },
    text: {
      primary: '#1A1A2E',
      secondary: '#4A4A6A',
      disabled: '#9E9E9E',
      hint: '#6E6E6E'
    },
    // Status colors
    status: {
      success: '#00C853',
      warning: '#FFD600',
      error: '#FF1744',
      info: '#00B0FF'
    }
  },
  
  // Typography
  typography: {
    fontFamily: "'Poppins', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.4
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      textTransform: 'uppercase'
    }
  },
  
  // Spacing
  spacing: (factor) => `${0.5 * factor}rem`,
  
  // Borders and shadows
  shape: {
    borderRadius: '8px',
    borderRadiusSmall: '4px',
    borderRadiusLarge: '12px'
  },
  shadows: {
    small: '0 2px 8px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 12px rgba(0, 0, 0, 0.15)',
    large: '0 8px 24px rgba(0, 0, 0, 0.2)',
    button: '0 4px 6px rgba(41, 98, 255, 0.25)',
    buttonHover: '0 6px 10px rgba(41, 98, 255, 0.35)',
    card: '0 10px 30px rgba(0, 0, 0, 0.08)',
    navbar: '0 4px 10px rgba(0, 0, 0, 0.1)'
  },
  
  // Transitions
  transitions: {
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)'
    },
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195
    }
  },
  
  // Component specific styles
  components: {
    // Button styles
    button: {
      primary: {
        backgroundColor: '#2962FF',
        color: '#FFFFFF',
        hoverBackgroundColor: '#0039CB',
        focusBackgroundColor: '#0039CB',
        disabledBackgroundColor: 'rgba(41, 98, 255, 0.5)',
        boxShadow: '0 4px 6px rgba(41, 98, 255, 0.25)'
      },
      secondary: {
        backgroundColor: '#F50057',
        color: '#FFFFFF',
        hoverBackgroundColor: '#BB002F',
        focusBackgroundColor: '#BB002F',
        disabledBackgroundColor: 'rgba(245, 0, 87, 0.5)',
        boxShadow: '0 4px 6px rgba(245, 0, 87, 0.25)'
      },
      outlined: {
        borderColor: '#2962FF',
        color: '#2962FF',
        hoverBackgroundColor: 'rgba(41, 98, 255, 0.08)',
        focusBackgroundColor: 'rgba(41, 98, 255, 0.12)'
      },
      text: {
        color: '#2962FF',
        hoverBackgroundColor: 'rgba(41, 98, 255, 0.08)',
        focusBackgroundColor: 'rgba(41, 98, 255, 0.12)'
      }
    },
    
    // Card styles
    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
      hoverBoxShadow: '0 14px 40px rgba(0, 0, 0, 0.12)',
      headerBackground: 'linear-gradient(45deg, rgba(41, 98, 255, 0.05) 0%, rgba(245, 0, 87, 0.05) 100%)'
    },
    
    // Input styles
    input: {
      borderColor: '#E0E0E0',
      focusBorderColor: '#2962FF',
      errorBorderColor: '#FF1744',
      backgroundColor: '#FFFFFF',
      disabledBackgroundColor: '#F5F5F5',
      placeholderColor: '#9E9E9E',
      borderRadius: '8px',
      padding: '12px 16px'
    },
    
    // Navbar styles
    navbar: {
      backgroundColor: '#FFFFFF',
      textColor: '#1A1A2E',
      activeTextColor: '#2962FF',
      hoverTextColor: '#F50057',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      height: '70px'
    },
    
    // Sidebar styles
    sidebar: {
      backgroundColor: '#FFFFFF',
      textColor: '#1A1A2E',
      activeBackgroundColor: 'rgba(41, 98, 255, 0.08)',
      activeTextColor: '#2962FF',
      hoverBackgroundColor: 'rgba(41, 98, 255, 0.04)',
      hoverTextColor: '#2962FF',
      width: '250px',
      collapsedWidth: '70px',
      boxShadow: '0 0 15px rgba(0, 0, 0, 0.05)'
    },
    
    // Table styles
    table: {
      headerBackgroundColor: 'rgba(41, 98, 255, 0.05)',
      headerTextColor: '#1A1A2E',
      rowHoverBackgroundColor: 'rgba(41, 98, 255, 0.02)',
      borderColor: '#E0E0E0',
      stripedRowBackgroundColor: 'rgba(245, 0, 87, 0.02)'
    }
  }
};

export default theme;
