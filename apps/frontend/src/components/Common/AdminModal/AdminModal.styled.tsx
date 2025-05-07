import styled from '@emotion/styled';

export const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ModalContent = styled.div`
  background: #3a3a3a;
  border-radius: 10px;
  padding: 20px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  position: relative;

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    font-size: 24px;
    color: #fff;
    margin: 0;
  }

  button {
    background: none;
    border: none;
    color: #fff;
    font-size: 24px;
    cursor: pointer;
  }
`;

export const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;

  input {
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #6a5acd;
    background: #5c5c5c;
    color: #fff;
    font-size: 16px;

    &:focus {
      outline: none;
      border-color: #8a79e6;
    }
  }

  button {
    padding: 12px 20px;
    background-color: #6a5acd;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.1s;
    z-index: 999;

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
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  font-size: 26px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
`;