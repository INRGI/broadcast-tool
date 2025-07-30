import styled from "@emotion/styled";
import React from "react";
import Dropdown from "../../Common/Dropdown/Dropdown";

const SectionWrapper = styled.div`
  width: calc(100%);
  padding: 10px;
  background-color: #2b2b2b;
  border: 1px solid #4f4f4f;
  border-radius: 8px;
`;

const FieldRow = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  align-items: center;
`;

const StyledInput = styled.input`
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #4f4f4f;
  background-color: #3a3a3a;
  color: white;
  flex: 1;
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
  margin: 0;

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

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
`;

interface SimpleLimitItem {
  key: string;
  value: string | number;
}

interface ArrayInputProps {
  items: SimpleLimitItem[];
  title: string;
  onChange: (items: SimpleLimitItem[]) => void;
  valueLabel: string;
  valuePlaceholder?: string;
  uniquePartners: string[];
}

const PartnerMinLimitPerDay: React.FC<ArrayInputProps> = ({
  items,
  onChange,
  valueLabel,
  valuePlaceholder = "",
  title,
  uniquePartners = [],
}) => {
  const handleAdd = () => {
    onChange([...items, { key: "", value: "" }]);
  };

  const handleRemove = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    onChange(newItems);
  };

  const handleChange = (
    index: number,
    field: "key" | "value",
    newValue: string
  ) => {
    const newItems = [...items];

    if (field === "value") {
      if (!/^[0-9]*$/.test(newValue)) return;
      newItems[index][field] = newValue === "" ? "" : Number(newValue);
    } else {
      newItems[index][field] = newValue;
    }

    onChange(newItems);
  };

  return (
    <SectionWrapper>
      <Title>{title}</Title>
      {items.map((item, index) => (
        <FieldRow key={index}>
          <InputContainer>
            <Label>Partner</Label>
            <Dropdown
              options={uniquePartners}
              selected={item.key}
              onSelect={(option) => {
                handleChange(index, "key", option);
              }}
              placeholder="Select Partner"
            />
          </InputContainer>
          <InputContainer>
            <Label>{valueLabel}</Label>
            <StyledInput
              placeholder={valuePlaceholder}
              value={item.value}
              onChange={(e) => handleChange(index, "value", e.target.value)}
              inputMode="numeric"
              pattern="[0-9]*"
            />
          </InputContainer>
          <RemoveButton onClick={() => handleRemove(index)}>✕</RemoveButton>
        </FieldRow>
      ))}
      <AddButton onClick={handleAdd}>+ Add</AddButton>
    </SectionWrapper>
  );
};

export default PartnerMinLimitPerDay;
