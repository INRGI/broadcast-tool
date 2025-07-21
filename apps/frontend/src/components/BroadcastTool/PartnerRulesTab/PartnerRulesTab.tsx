import { PartnerRules } from "../../../types/broadcast-tool";
import FloatingLabelNumberInput from "../../Common/FloatingLabelInput/FloatingLabelNumberInput";
import MultiSelectDropdown from "../../Common/MultiSelectDropdown";
import {
  InputContainer,
  InputGroup,
  RuleContainer,
} from "../DomainRulesTab/DomainRulesTab.styled";
import PartnerAllowedDaysEditor from "../PartnerAllowedDaysEditor";

interface PartnerRulesTabProps {
  partnerRules: PartnerRules;
  partners: string[];
  onChange: (updated: PartnerRules) => void;
}

const PartnerRulesTab: React.FC<PartnerRulesTabProps> = ({
  partnerRules,
  partners,
  onChange,
}) => {
  return (
    <RuleContainer>
      <InputGroup>
        <InputContainer>
          <MultiSelectDropdown
            options={partners}
            selected={partnerRules.blacklistedPartners}
            onChange={(newValues) =>
              onChange({
                ...partnerRules,
                blacklistedPartners: newValues,
              })
            }
            placeholder="Blacklisted Partners"
          />
        </InputContainer>
      </InputGroup>

      <InputGroup>
        <InputContainer>
          <FloatingLabelNumberInput
            placeholder="Similar Partner Domain Limit"
            value={partnerRules.similarPartnerDomainLimit}
            onChange={(e) =>
              onChange({
                ...partnerRules,
                similarPartnerDomainLimit: Number(e.target.value),
              })
            }
          />
        </InputContainer>
      </InputGroup>

      <InputGroup>
        <PartnerAllowedDaysEditor
          items={partnerRules.partnerAllowedSendingDays}
          onChange={(updated) =>
            onChange({
              ...partnerRules,
              partnerAllowedSendingDays: updated,
            })
          }
          uniquePartners={partners}
        />
      </InputGroup>
    </RuleContainer>
  );
};

export default PartnerRulesTab;
