import styled from "@emotion/styled";

export const SaveButton = styled.button`
  padding: 13px 20px;
  background-color: #6a5acd;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.1s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: inline-block;
  width: 100%;

  &:hover {
    background-color: #5941a9;
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(106, 90, 205, 0.6);
  }
`;

export const CreateContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 900px;
  max-width: 900px;
  height: 80vh;
  width: 100%;
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

export const BlockHeader = styled.div`
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-content: center;

  h2 {
    font-size: 30px;
    line-height: 1.2;
    color: #fff;
    margin: 0;
    font-weight: 500;
    font-family: "Arial Black", sans-serif;
    text-transform: uppercase;
    border-bottom: 2px solid #fff;
  }

  p {
    text-transform: uppercase;
    font-size: 20px;
    color: #fff;
    margin: 0;
    padding: 0;
    padding-left: 2px;
  }

  @media (max-width: 1023px) {
    h2 {
      font-size: 22px;
    }
    p {
      font-size: 15px;
    }
  }

  @media (max-width: 430px) {
    h2 {
      font-size: 16px;
    }
    p {
      font-size: 14px;
    }
  }
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
