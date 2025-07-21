import styled from "@emotion/styled";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-width: calc(100vw);
  max-width: calc(100vw);
  height: 90vh;
  width: calc(100%);
  gap: 20px;
  background-color: #181818;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.4);
  justify-content: flex-start;
  align-items: flex-start;
  overflow-y: scroll;
`;

export const LoadingContainer = styled(Container)`
  justify-content: center;
  align-items: center;
`;
