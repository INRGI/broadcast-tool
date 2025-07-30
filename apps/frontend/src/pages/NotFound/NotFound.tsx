import React from 'react';
import { BackButton, NotFoundContainer, Subtitle, Title } from './NotFound.styled';


const NotFound: React.FC = () => {
  
  return (
    <NotFoundContainer>
      <img
        src="/notfound.gif"
        alt="Loading cat"
        style={{
          width: `200px`,
        }}
      />
      {/* <Title>404</Title> */}
      <Subtitle>Page Not Found</Subtitle>
      <BackButton to="/">Go Back</BackButton>
    </NotFoundContainer>
  );
};

export default NotFound;
