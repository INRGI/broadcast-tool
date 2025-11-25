import styled from "@emotion/styled";
import React, { useState } from "react";
import Dropdown from "../../Common/Dropdown/Dropdown";
import PartnerMaxCopyLimit from "../PartnerMaxCopyLimit";

const Wrapper = styled.div`
  width: calc(100% - 20px);
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const SheetSelector = styled.div`
  width: calc(100%);
  padding: 10px;
  background-color: #2b2b2b;
  border: 1px solid #4f4f4f;
  border-radius: 8px;
`;

const Title = styled.p`
  color: white;
  font-size: 16px;
  margin: 0 0 15px 0;
  padding: 0;
  text-align: center;
  font-weight: 500;
`;

interface PartnerTabLimit {
  sheetName: string;
  partnerName: string;
  limit: number;
}

interface PartnerTabLimitInputProps {
  items: PartnerTabLimit[];
  title: string;
  onChange: (items: PartnerTabLimit[]) => void;
  availableSheetNames: string[];
  uniquePartners: string[];
}

const PartnerTabLimitInput: React.FC<PartnerTabLimitInputProps> = ({
  items,
  onChange,
  title,
  availableSheetNames,
  uniquePartners,
}) => {
  const [selectedSheet, setSelectedSheet] = useState<string>(
    availableSheetNames[0] || ""
  );

  const itemsForSheet = items.filter(
    (item) => item.sheetName === selectedSheet
  );

  const simplifiedItems = itemsForSheet.map((item) => ({
    key: item.partnerName,
    value: item.limit,
  }));

  const handleChange = (
    newSimplifiedItems: { key: string; value: string | number }[]
  ) => {
    const otherSheetItems = items.filter(
      (item) => item.sheetName !== selectedSheet
    );

    const newSheetItems = newSimplifiedItems.map((item) => ({
      sheetName: selectedSheet,
      partnerName: item.key,
      limit: Number(item.value),
    }));

    onChange([...otherSheetItems, ...newSheetItems]);
  };

  return (
    <Wrapper>
      <SheetSelector>
        <Title>{title}</Title>
        <Dropdown
          options={availableSheetNames}
          selected={selectedSheet}
          onSelect={(option) => setSelectedSheet(option)}
          placeholder="Select Sheet"
        />
      </SheetSelector>

      {selectedSheet && (
        <PartnerMaxCopyLimit
          items={simplifiedItems}
          title={`Partner Limits for "${selectedSheet}"`}
          valueLabel="Limit"
          valuePlaceholder="Enter limit"
          uniquePartners={uniquePartners}
          onChange={handleChange}
        />
      )}
    </Wrapper>
  );
};

export default PartnerTabLimitInput;
