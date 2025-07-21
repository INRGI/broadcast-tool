import styled from "@emotion/styled";
import React from "react";

const Wrapper = styled.div`
  width: 100%;
  padding: 10px;
  background-color: #2b2b2b;
  border: 1px solid #4f4f4f;
  border-radius: 8px;
`;

const Title = styled.p`
  color: white;
  margin: 0;
  padding: 0;
  margin-bottom: 15px;
  text-align: center;
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #4f4f4f;
  background-color: #3a3a3a;
  color: white;
`;

const CheckboxRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  color: white;
`;

const AddButton = styled.button`
  background-color: #6a5acd;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 14px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 8px;

  &:hover {
    background-color: #5941a9;
  }
`;

const RemoveButton = styled.button`
  background-color: #d9534f;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 10px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 6px;
  align-self: flex-start;

  &:hover {
    background-color: #c9302c;
  }
`;

interface ProductAllowedSendingDays {
  product: string;
  allowedSendingDays: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
}

interface ProductAllowedDaysEditorProps {
  items: ProductAllowedSendingDays[];
  onChange: (items: ProductAllowedSendingDays[]) => void;
}

const ProductAllowedDaysEditor: React.FC<ProductAllowedDaysEditorProps> = ({ items, onChange }) => {
  const handleToggle = (index: number, day: keyof ProductAllowedSendingDays["allowedSendingDays"]) => {
    const updated = [...items];
    updated[index].allowedSendingDays[day] = !updated[index].allowedSendingDays[day];
    onChange(updated);
  };

  const handleRename = (index: number, newName: string) => {
    const updated = [...items];
    updated[index].product = newName;
    onChange(updated);
  };

  const handleAdd = () => {
    onChange([
      ...items,
      {
        product: "",
        allowedSendingDays: {
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false,
          sunday: false,
        },
      },
    ]);
  };

  const handleRemove = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <Wrapper>
      <Title>Product Allowed Sending Days</Title>
      {items.map((item, index) => (
        <Row key={index}>
          <Input
            placeholder="Enter product name"
            value={item.product}
            onChange={(e) => handleRename(index, e.target.value)}
          />
          <CheckboxRow>
            {(Object.keys(item.allowedSendingDays) as (keyof ProductAllowedSendingDays["allowedSendingDays"])[]).map(
              (day) => (
                <CheckboxLabel key={day}>
                  <input
                    type="checkbox"
                    checked={item.allowedSendingDays[day]}
                    onChange={() => handleToggle(index, day)}
                  />
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </CheckboxLabel>
              )
            )}
          </CheckboxRow>
          <RemoveButton onClick={() => handleRemove(index)}>✕ Remove</RemoveButton>
        </Row>
      ))}
      <AddButton onClick={handleAdd}>+ Add Product</AddButton>
    </Wrapper>
  );
};

export default ProductAllowedDaysEditor;