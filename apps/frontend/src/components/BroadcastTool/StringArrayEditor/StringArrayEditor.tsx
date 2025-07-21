import styled from "@emotion/styled";
import React from "react";

const SectionWrapper = styled.div`
  width: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #2b2b2b;
  border: 1px solid #4f4f4f;
  border-radius: 8px;
  margin: 0;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.p`
  color: white;
  padding: 0;
  margin: 0;
  font-size: 16px;
`;

const AddButton = styled.button`
  background-color: #6a5acd;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #5941a9;
  }
`;

const FieldRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const StyledInput = styled.input`
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #4f4f4f;
  background-color: #3a3a3a;
  color: white;
  font-size: 14px;
`;

const RemoveButton = styled.button`
  background-color: #d9534f;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 14px;

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

interface StringArrayEditorProps {
  items: string[];
  title: string;
  onChange: (items: string[]) => void;
  keyLabel: string;
  keyPlaceholder?: string;
}

const StringArrayEditor: React.FC<StringArrayEditorProps> = ({
  items,
  onChange,
  keyLabel,
  keyPlaceholder = "",
  title,
}) => {
  const handleAdd = () => {
    onChange([...items, ""]);
  };

  const handleRemove = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    onChange(newItems);
  };

  const handleChange = (index: number, newValue: string) => {
    const newItems = [...items];
    newItems[index] = newValue;
    onChange(newItems);
  };

  return (
    <SectionWrapper>
      <Header>
        <Title>{title}</Title>
        <AddButton onClick={handleAdd}>+ Add</AddButton>
      </Header>
      {items.map((item, index) => (
        <FieldRow key={index}>
          <InputWrapper>
            <Label>{keyLabel}</Label>
            <StyledInput
              placeholder={keyPlaceholder}
              value={item}
              onChange={(e) => handleChange(index, e.target.value)}
            />
          </InputWrapper>
          <RemoveButton onClick={() => handleRemove(index)}>✕</RemoveButton>
        </FieldRow>
      ))}
    </SectionWrapper>
  );
};

export default StringArrayEditor;
