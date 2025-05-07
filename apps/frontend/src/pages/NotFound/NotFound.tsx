import React from 'react';
import { BackButton, NotFoundContainer, Subtitle, Title } from './NotFound.styled';


const NotFound: React.FC = () => {
  
  return (
    <NotFoundContainer>
      <Title>404</Title>
      <Subtitle>Page Not Found</Subtitle>
      <BackButton to="/">Go Back</BackButton>
    </NotFoundContainer>
  );
};

export default NotFound;
