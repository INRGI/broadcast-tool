import styled from "@emotion/styled";
import { CopyTabLimit } from "../../../types/broadcast-tool/copy-tab-limit.interface";
import React, { useEffect, useState } from "react";
import { BsFire } from "react-icons/bs";
import { IoIosSunny } from "react-icons/io";

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
  max-width: 50px;
`;

const Label = styled.label`
  color: white;
  font-size: 14px;
  width: 100%;
  margin-bottom: 4px;
  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.p`
  color: white;
  font-size: 16px;
  margin: 0 0 16px;
  padding: 0;
  text-align: center;
`;

const Indicator = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #ccc;
  background-color: #2e2e2e;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
`;

const ClearDiv = styled.div`
  padding: 0;
  margin: 0;
  display: flex;
  gap: 4px;
  align-items: center;
`;

interface CopyTabLimitInputProps {
  title: string;
  items: CopyTabLimit[];
  statuses: { sheetName: string; live: number; warmup: number }[];
  availableSheetNames: string[];
  onChange: (items: CopyTabLimit[]) => void;
}

const CopyTabLimitInput: React.FC<CopyTabLimitInputProps> = ({
  title,
  items = [],
  availableSheetNames,
  onChange,
  statuses,
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
          <Label>
            {item.sheetName}
            <ClearDiv>
              <Indicator>
                <IoIosSunny />
                {statuses.find((s) => s.sheetName === item.sheetName)?.live ||
                  0}
              </Indicator>
              <Indicator>
                <BsFire />
                {statuses.find((s) => s.sheetName === item.sheetName)?.warmup ||
                  0}
              </Indicator>
            </ClearDiv>
          </Label>
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
