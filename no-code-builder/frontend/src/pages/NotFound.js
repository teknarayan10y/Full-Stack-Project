import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 64px);
  padding: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 6rem;
  color: #4A90E2;
  margin: 0;
  line-height: 1;
`;

const Subtitle = styled.h2`
  font-size: 2rem;
  color: #333;
  margin: 1rem 0 2rem;
`;

const Text = styled.p`
  color: #666;
  font-size: 1.1rem;
  max-width: 500px;
  margin-bottom: 2rem;
`;

const Button = styled(Link)`
  background-color: #4A90E2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #3A80D2;
  }
`;

const NotFound = () => {
  return (
    <NotFoundContainer>
      <Title>404</Title>
      <Subtitle>Page Not Found</Subtitle>
      <Text>
        The page you are looking for might have been removed, had its name changed,
        or is temporarily unavailable.
      </Text>
      <Button to="/dashboard">Back to Dashboard</Button>
    </NotFoundContainer>
  );
};

export default NotFound;
