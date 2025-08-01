import React, { useEffect, useState } from "react";
import AdminModal from "../AdminModal";
import {
  AddButton,
  Button,
  FieldRow,
  HeaderContainer,
  InputContainer,
  Label,
  ModalBody,
  RemoveButton,
  SectionWrapper,
  StyledInput,
  Title,
  Textarea,
  ModalContentWrapper,
  ModalLeft,
  ModalRight,
  PreviewItem,
  SubmitButton,
} from "./ArrayInput.styled";
import { FaPlus } from "react-icons/fa";

interface SimpleLimitItem {
  key: string;
  value: string | number;
}

interface ArrayInputProps {
  items: SimpleLimitItem[];
  title: string;
  onChange: (items: SimpleLimitItem[]) => void;
  keyLabel: string;
  valueLabel: string;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  isBulkAdder?: boolean;
}

const ArrayInput: React.FC<ArrayInputProps> = ({
  items,
  onChange,
  keyLabel,
  valueLabel,
  keyPlaceholder = "",
  valuePlaceholder = "",
  title,
  isBulkAdder = false,
}) => {
  const [bulkText, setBulkText] = useState("");
  const [bulkValue, setBulkValue] = useState("0");
  const [bulkPreview, setBulkPreview] = useState<SimpleLimitItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleBulkTextChange = (text: string) => {
    setBulkText(text);
  };

  const handleBulkSubmit = () => {
    if (!bulkValue || bulkPreview.length === 0) return;
    const newItems = [...items, ...bulkPreview];
    onChange(newItems);
    setBulkText("");
    setBulkValue("");
    setBulkPreview([]);
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setBulkText("");
    setBulkValue("");
    setBulkPreview([]);
  };

  useEffect(() => {
    const keys = bulkText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    setBulkPreview(
      keys.map((key) => ({
        key,
        value: bulkValue === "" ? "" : Number(bulkValue),
      }))
    );
  }, [bulkValue, bulkText]);

  return (
    <SectionWrapper>
      {isBulkAdder && (
        <HeaderContainer>
          <Title>{title}</Title>

          <Button onClick={() => setIsModalOpen(true)}>
            <FaPlus />
          </Button>
        </HeaderContainer>
      )}
      {!isBulkAdder && <Title>{title}</Title>}
      {items.map((item, index) => (
        <FieldRow key={index}>
          <InputContainer>
            <Label>{keyLabel}</Label>
            <StyledInput
              placeholder={keyPlaceholder}
              value={item.key}
              onChange={(e) => handleChange(index, "key", e.target.value)}
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

      {isModalOpen && (
        <AdminModal isOpen={isModalOpen} onClose={handleCloseModal}>
          <ModalBody>
            <ModalContentWrapper>
              <ModalLeft>
                <Label>{keyLabel} (one per line):</Label>
                <Textarea
                  rows={10}
                  value={bulkText}
                  onChange={(e) => handleBulkTextChange(e.target.value)}
                  placeholder="Enter one key per line"
                />
                <InputContainer>
                  <Label>{valueLabel}</Label>
                  <StyledInput
                    placeholder={valuePlaceholder}
                    value={bulkValue}
                    onChange={(e) => setBulkValue(e.target.value)}
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                </InputContainer>
                <SubmitButton
                  onClick={handleBulkSubmit}
                  disabled={!bulkPreview.length || !/^[0-9]+$/.test(bulkValue)}
                >
                  Submit
                </SubmitButton>
              </ModalLeft>

              <ModalRight>
                <Label>Preview:</Label>

                {bulkPreview.map((item, i) => (
                  <PreviewItem key={i}>
                    <strong>{item.key}</strong>: {item.value}
                  </PreviewItem>
                ))}
              </ModalRight>
            </ModalContentWrapper>
          </ModalBody>
        </AdminModal>
      )}
    </SectionWrapper>
  );
};

export default ArrayInput;
