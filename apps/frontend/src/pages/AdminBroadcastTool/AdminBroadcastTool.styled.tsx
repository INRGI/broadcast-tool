import styled from "@emotion/styled";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background-color: #2b2b2b;
  background-image: linear-gradient(to bottom right, #1e1e1e, #3a3a3a);
  height: calc(100vh - 40px);
`;

export const AuthWrapper = styled.div`
  background-color: #2b2b2b;
  padding: 40px;
  border-radius: 12px;
  max-width: 480px;
  width: 100%;
  margin: 80px auto;
  text-align: center;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.5);
`;

export const Title = styled.h2`
  color: white;
  font-size: 24px;
  margin-bottom: 20px;
`;