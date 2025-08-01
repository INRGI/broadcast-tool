import {
  GetDomainStatusesResponse,
  GetProductStatusesResponse,
} from "../../../api/monday";
import { DomainRules } from "../../../types/broadcast-tool";
import MultiSelectDropdown from "../../Common/MultiSelectDropdown";
import DomainSendingEditor from "../DomainSendingEditor";
import {
  InputContainer,
  InputGroup,
  RuleContainer,
} from "./DomainRulesTab.styled";

interface DomainRulesTabProps {
  domainRules: DomainRules;
  isPreview?: boolean;
  onChange: (updated: DomainRules) => void;
  domainMondayStatuses: GetDomainStatusesResponse;
  productMondayStatuses: GetProductStatusesResponse;
}

const DomainRulesTab: React.FC<DomainRulesTabProps> = ({
  domainRules,
  onChange,
  isPreview,
  domainMondayStatuses,
  productMondayStatuses,
}) => {
  return (
    <RuleContainer>
      <InputGroup disabled={isPreview}>
        <InputContainer>
          <MultiSelectDropdown
            options={domainMondayStatuses.uniqueDomainStatuses}
            selected={domainRules.allowedMondayStatuses}
            onChange={(newValues) =>
              onChange({
                ...domainRules,
                allowedMondayStatuses: newValues,
              })
            }
            placeholder="Allowed Monday Statuses"
          />
        </InputContainer>
      </InputGroup>

      <InputGroup disabled={isPreview}>
        <DomainSendingEditor
          items={domainRules.domainSending}
          onChange={(newItems) =>
            onChange({
              ...domainRules,
              domainSending: newItems,
            })
          }
          title="Domain Sending Rules"
          parentCompanies={domainMondayStatuses.uniqueParentCompanies}
          mondayStatuses={productMondayStatuses.domainSendings}
        />
      </InputGroup>
    </RuleContainer>
  );
};

export default DomainRulesTab;
