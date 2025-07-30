import React from "react";
import { BroadcastListItemResponse } from "../../../api/broadcast/response/broadcast-list-item.response.dto";
import FloatingLabelInput from "../../Common/FloatingLabelInput/FloatingLabelInput";
import {
  InputContainer,
  InputGroup,
  RuleContainer,
} from "../DomainRulesTab/DomainRulesTab.styled";
import Dropdown from "../../Common/Dropdown/Dropdown";
import { SaveButton, WhiteText } from "./GeneralTab.styled";
import { Checkbox } from "@mui/material";
import { common } from "@mui/material/colors";

interface GeneralTabProps {
  name: string;
  useOnlyTeamAnalytics: boolean;
  broadcastSpreadsheetId: string;
  broadcastsList: BroadcastListItemResponse[];
  onChange: (updated: {
    name?: string;
    useOnlyTeamAnalytics?: boolean;
    broadcastSpreadsheetId?: string;
  }) => void;
  onConfirmRequest?: () => void;
}

const GeneralTab: React.FC<GeneralTabProps> = ({
  name,
  broadcastSpreadsheetId,
  useOnlyTeamAnalytics,
  broadcastsList = [],
  onChange,
  onConfirmRequest,
}) => {
  const selectedName =
    broadcastsList.find((b) => b.fileId === broadcastSpreadsheetId)
      ?.sheetName || "";

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
            const selected = broadcastsList.find(
              (item) => item.sheetName === option
            );
            if (selected) {
              onChange({ broadcastSpreadsheetId: selected.fileId });
            }
          }}
          placeholder="Select Broadcast Sheet"
        />
      </InputGroup>
      <InputGroup>
        <Checkbox
          checked={useOnlyTeamAnalytics}
          onChange={(e) => onChange({ useOnlyTeamAnalytics: e.target.checked })}
          sx={{
            color: common.white,
            '&.Mui-checked': {
              color: common.white,
            },
          }}
        />
        <WhiteText>Use only team analytics</WhiteText>
      </InputGroup>
      <InputGroup>
        <SaveButton onClick={() => onConfirmRequest?.()}>Create</SaveButton>
      </InputGroup>
    </RuleContainer>
  );
};

export default GeneralTab;
