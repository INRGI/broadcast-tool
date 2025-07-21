import styled from "@emotion/styled";
import { CopyTabLimit } from "../../../types/broadcast-tool/copy-tab-limit.interface";
import React, { useEffect, useState } from "react";

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
  align-items: center;
  justify-content: space-between;
`;

const StyledInput = styled.input`
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #4f4f4f;
  background-color: #3a3a3a;
  color: white;
  font-size: 14px;
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
  margin: 0 0 16px;
  padding: 0;
  text-align: center;
`;

interface CopyTabLimitInputProps {
  title: string;
  items: CopyTabLimit[];
  availableSheetNames: string[];
  onChange: (items: CopyTabLimit[]) => void;
}

const CopyTabLimitInput: React.FC<CopyTabLimitInputProps> = ({
  title,
  items = [],
  availableSheetNames,
  onChange,
}) => {
  const [localLimits, setLocalLimits] = useState<CopyTabLimit[]>([]);

  useEffect(() => {
    const merged = availableSheetNames.map((sheetName) => {
      const existing = items.find((i) => i.sheetName === sheetName);
      return {
        sheetName,
        limit: existing?.limit ?? 1,
      };
    });
    setLocalLimits(merged);

    if (items.length === 0) {
      onChange(merged);
    }
  }, [items, availableSheetNames]);

  const handleLimitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const updated = [...localLimits];
    updated[index].limit = value === "" ? 0 : Number(value);
    setLocalLimits(updated);
    onChange(updated);
  };

  return (
    <SectionWrapper>
      <Title>{title}</Title>
      {localLimits.map((item, index) => (
        <FieldRow key={item.sheetName}>
          <Label>{item.sheetName}</Label>
          <StyledInput
            value={item.limit}
            onChange={(e) => handleLimitChange(index, e.target.value)}
            inputMode="numeric"
            pattern="[0-9]*"
          />
        </FieldRow>
      ))}
    </SectionWrapper>
  );
};

export default CopyTabLimitInput;
