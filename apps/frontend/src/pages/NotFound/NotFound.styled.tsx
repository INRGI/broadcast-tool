import styled from '@emotion/styled';
import { NavLink } from 'react-router-dom';

export const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #2c2c2c;
  color: #ffffff;
  text-align: center;
`;

export const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #f5f5f5;
`;

export const Subtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  color: #cccccc;
`;

export const BackButton = styled(NavLink)`
  padding: 0.75rem 1.5rem;
  border: 2px solid #ffffff;
  border-radius: 5px;
  font-size: 1rem;
  text-decoration: none;
  color: #ffffff;
  background-color: transparent;
  transition: all 0.3s ease;

  &:hover {
    background-color: #ffffff;
    color: #2c2c2c;
  }
`;