import styled from "@emotion/styled";
import React from "react";
import MultiSelectDropdown from "../../Common/MultiSelectDropdown";

const SectionWrapper = styled.div`
  width: 100%;
  padding: 10px;
  background-color: #2b2b2b;
  border: 1px solid #4f4f4f;
  border-radius: 8px;
`;

const FieldRow = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  align-items: flex-start;
`;

const StyledSelect = styled.select`
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #4f4f4f;
  background-color: #3a3a3a;
  color: white;
  width: 100%;
  font-size: 14px;
`;

const AddButton = styled.button`
  background-color: #6a5acd;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #5941a9;
  }
`;

const RemoveButton = styled.button`
  background-color: #d9534f;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 22px;

  &:hover {
    background-color: #c9302c;
  }
`;

const Label = styled.label`
  color: white;
  font-size: 14px;
  margin-bottom: 4px;
  display: block;
`;

const Title = styled.p`
  color: white;
  font-size: 16px;
  margin: 0;
  padding: 0;
  text-align: center;
  padding-bottom: 20px;
`;

interface DomainSendingItem {
  parentCompany: string;
  allowedMondayStatuses: string[];
}

interface DomainSendingEditorProps {
  items: DomainSendingItem[];
  title: string;
  onChange: (items: DomainSendingItem[]) => void;
  parentCompanies: string[];
  mondayStatuses: string[];
}

const DomainSendingEditor: React.FC<DomainSendingEditorProps> = ({
  items,
  onChange,
  title,
  parentCompanies,
  mondayStatuses,
}) => {
  const handleAdd = () => {
    onChange([...items, { parentCompany: "", allowedMondayStatuses: [] }]);
  };

  const handleRemove = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    onChange(newItems);
  };

  const handleChange = <K extends keyof DomainSendingItem>(
    index: number,
    field: K,
    newValue: DomainSendingItem[K]
  ) => {
    const newItems = [...items];
    newItems[index][field] = newValue;
    onChange(newItems);
  };

  return (
    <SectionWrapper>
      <Title>{title}</Title>
      {items.map((item, index) => (
        <FieldRow key={index}>
          <div style={{ flex: 1 }}>
            <Label>Parent Company</Label>
            <StyledSelect
              value={item.parentCompany}
              onChange={(e) =>
                handleChange(index, "parentCompany", e.target.value)
              }
            >
              <option value="">Select</option>
              {(parentCompanies ?? []).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </StyledSelect>
          </div>
          <div style={{ flex: 1 }}>
            <Label>Allowed Statuses</Label>
            <MultiSelectDropdown
              options={mondayStatuses}
              selected={item.allowedMondayStatuses}
              onChange={(newValues) =>
                handleChange(index, "allowedMondayStatuses", newValues)
              }
              placeholder="Select statuses"
            />
          </div>
          <RemoveButton onClick={() => handleRemove(index)}>✕</RemoveButton>
        </FieldRow>
      ))}
      <AddButton onClick={handleAdd}>+ Add</AddButton>
    </SectionWrapper>
  );
};

export default DomainSendingEditor;
