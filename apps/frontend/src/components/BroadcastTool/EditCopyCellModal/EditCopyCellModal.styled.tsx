import styled from "@emotion/styled";

export const ModalWrapper = styled.div`
  padding: 20px;
  background-color: #1f1f1f;
  color: white;
  border-radius: 8px;
`;

export const Section = styled.div`
  margin-bottom: 20px;
  max-height: 200px;
  overflow-y: auto;
`;

export const SectionTitle = styled.h4`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  color: #ddd;
  font-size: 16px;
`;

export const CopyRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #2b2b2b;
  border: 1px solid #444;
  padding: 8px 12px;
  gap: 10px;
  border-radius: 6px;
  margin-bottom: 6px;
`;

export const CopyName = styled.span`
  font-weight: bold;
`;

export const ActionButton = styled.button`
  background-color: #444;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  display: flex;
  gap: 10px;
  align-items: center;

  &:hover {
    background-color: #666;
  }
`;
