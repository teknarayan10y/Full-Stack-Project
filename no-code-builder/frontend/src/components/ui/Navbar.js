import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: ${props => props.theme.components.navbar.backgroundColor};
  box-shadow: ${props => props.theme.components.navbar.boxShadow};
  height: ${props => props.theme.components.navbar.height};
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.theme.colors.text.primary};
  background: ${props => props.theme.colors.gradients.blueToRed};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  display: flex;
  align-items: center;
  
  &:hover {
    color: #f0f0f0;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const NavLink = styled(Link)`
  color: ${props => props.theme.components.navbar.textColor};
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.shape.borderRadiusSmall};
  position: relative;

  &:hover {
    color: ${props => props.theme.components.navbar.hoverTextColor};
    background-color: rgba(245, 0, 87, 0.05);
  }

  &.active {
    color: ${props => props.theme.components.navbar.activeTextColor};
    font-weight: 600;
    
    &:after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 100%;
      height: 3px;
      background: ${props => props.theme.colors.gradients.blueToRed};
      border-radius: 3px;
    }
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.theme.components.button.secondary.backgroundColor};
  color: ${props => props.theme.components.button.secondary.color};
  border: none;
  border-radius: ${props => props.theme.shape.borderRadius};
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: ${props => props.theme.components.button.secondary.boxShadow};

  &:hover {
    background-color: ${props => props.theme.components.button.secondary.hoverBackgroundColor};
    box-shadow: ${props => props.theme.shadows.buttonHover};
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <NavbarContainer>
      <Logo to="/">
        <span>No-Code Builder</span>
      </Logo>
      
      <NavLinks>
        {isAuthenticated ? (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/templates">Templates</NavLink>
            <NavLink to="/files">Files</NavLink>
            <NavLink to="/profile">Profile</NavLink>
            <Button onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </NavLinks>
    </NavbarContainer>
  );
};

export default Navbar;
