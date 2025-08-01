import styled from "@emotion/styled";

export const ModalBody = styled.div`
  background-color: #121212;
  padding: 24px;
  border-radius: 12px;
  width: 400px;
  max-width: 60vw;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const ClearDiv = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const StyledInput = styled.input`
  width: 80px;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #333;
  background-color: #1e1e1e;
  color: white;
  font-size: 14px;

  &:focus {
    border-color: #6a5acd;
    outline: none;
  }
`;

export const ActionButton = styled.button`
  padding: 8px 16px;
  background-color: #6a5acd;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s;

  &:hover:not(:disabled) {
    background-color: #5941a9;
  }

  &:active:not(:disabled) {
    transform: scale(0.97);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const CancelButton = styled(ActionButton)`
  background-color: #444;

  &:hover:not(:disabled) {
    background-color: #666;
  }
`;

export const ConfirmButton = styled(ActionButton)`
  background-color: #00b894;

  &:hover:not(:disabled) {
    background-color: #009e7d;
  }
`;

export const ActionGroup = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const SectionLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #aaa;
`;