import styled from "@emotion/styled";

export const PriorityWrapper = styled.div`
  background-color: #2a2a2a;
  border-radius: 8px;
  padding: 16px;
  margin: 8px 0;
  width: calc(50vw);
`;

export const PriorityHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export const PriorityTitle = styled.h4`
  margin: 0;
  color: #fca311;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
`;

export const PrioritySection = styled.div`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const SectionHeader = styled.h5`
  margin: 0 0 12px 0;
  color: #ccc;
  font-size: 13px;
  font-weight: 600;
`;

export const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;

export const QuantityInput = styled.input`
  width: 80px;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #4f4f4f;
  background-color: #3a3a3a;
  color: white;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #6a5acd;
  }
`;

export const QuantityLabel = styled.span`
  color: #ccc;
  font-size: 12px;
`;

export const InfoText = styled.div`
  color: #fca311;
  font-size: 11px;
  padding: 6px 12px;
  background-color: #3a3a3a;
  border-radius: 4px;
  border-left: 3px solid #fca311;
`;

export const DomainInputRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 12px;
`;

export const DomainSelect = styled.select`
  flex: 1;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #4f4f4f;
  background-color: #3a3a3a;
  color: white;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #6a5acd;
  }
`;

export const AddButton = styled.button`
  background-color: #6a5acd;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  height: 100%;

  &:hover:not(:disabled) {
    background-color: #5941a9;
  }

  &:disabled {
    background-color: #555;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const RemoveButton = styled.button`
  background-color: #d9534f;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 12px;

  &:hover {
    background-color: #c9302c;
  }
`;

export const SelectedDomainsWrapper = styled.div`
  background-color: #1f1f1f;
  border-radius: 6px;
  padding: 12px;
`;

export const SelectedDomainsHeader = styled.div`
  color: #ccc;
  font-size: 12px;
  margin-bottom: 8px;
  font-weight: 600;
`;

export const SelectedDomainsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const DomainChip = styled.div`
  display: flex;
  align-items: center;
  background-color: #3a3a3a;
  border-radius: 4px;
  padding: 4px 8px;
  border: 1px solid #4f4f4f;
`;

export const DomainName = styled.span`
  color: white;
  font-size: 12px;
  margin-right: 6px;
`;

export const RemoveChipButton = styled.button`
  background: none;
  border: none;
  color: #d9534f;
  cursor: pointer;
  padding: 2px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  font-size: 10px;

  &:hover {
    background-color: #d9534f;
    color: white;
  }
`;

export const EmptyState = styled.div`
  color: #777;
  font-style: italic;
  font-size: 12px;
  padding: 12px;
  background-color: #1f1f1f;
  border-radius: 4px;
  text-align: center;
`;
