import styled from "@emotion/styled";

export const AdminContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 90vh;
  width: calc(100% - 50px);
  gap: 20px;
  background-color: #181818;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.4);
  justify-content: flex-start;
  align-items: flex-start;
`;

export const Container = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
  flex-direction: column;
  align-content: center;
  overflow-y: scroll;
  height: calc(100%);
`;

export const TabsContainer = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 10px;
  align-items: center;
  padding-bottom: 4px;
  white-space: nowrap;
  width: calc(100%);
  height: 60px;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
`;

export const TabButton = styled.button<{ active: boolean }>`
  background-color: ${({ active }) => (active ? "#6a5acd" : "#3a3a3a")};
  padding: 13px 13px;
  display: inline-block;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.1s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: auto;

  &:hover {
    background-color: #5941a9;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(106, 90, 205, 0.6);
  }
`;
