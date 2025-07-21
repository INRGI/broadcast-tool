import React from "react";
import { BroadcastListItemResponse } from "../../../api/broadcast/response/broadcast-list-item.response.dto";
import FloatingLabelInput from "../../Common/FloatingLabelInput/FloatingLabelInput";
import {
  InputContainer,
  InputGroup,
  RuleContainer,
} from "../DomainRulesTab/DomainRulesTab.styled";
import Dropdown from "../../Common/Dropdown/Dropdown";
import { SaveButton } from "./GeneralTab.styled";

interface GeneralTabProps {
  name: string;
  broadcastSpreadsheetId: string;
  broadcastsList: BroadcastListItemResponse[];
  onChange: (updated: { name?: string; broadcastSpreadsheetId?: string }) => void;
  onConfirmRequest?: () => void;
}

const GeneralTab: React.FC<GeneralTabProps> = ({
  name,
  broadcastSpreadsheetId,
  broadcastsList = [],
  onChange,
  onConfirmRequest,
}) => {
  const selectedName = broadcastsList.find(b => b.fileId === broadcastSpreadsheetId)?.sheetName || "";

  return (
    <RuleContainer>
      <InputGroup>
        <InputContainer>
          <FloatingLabelInput
            placeholder="Broadcast Name"
            value={name}
            onChange={(e) => onChange({ name: e.target.value })}
          />
        </InputContainer>
      </InputGroup>

      <InputGroup>
        <Dropdown
          options={broadcastsList.map((item) => item.sheetName)}
          selected={selectedName}
          onSelect={(option) => {
            const selected = broadcastsList.find((item) => item.sheetName === option);
            if (selected) {
              onChange({ broadcastSpreadsheetId: selected.fileId });
            }
          }}
          placeholder="Select Broadcast Sheet"
        />
      </InputGroup>

      <InputGroup>
      <SaveButton onClick={() => onConfirmRequest?.()}>Create</SaveButton>
      </InputGroup>
    </RuleContainer>
  );
};

export default GeneralTab;
