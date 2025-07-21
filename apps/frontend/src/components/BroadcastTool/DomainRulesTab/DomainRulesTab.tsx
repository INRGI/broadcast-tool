import { GetDomainStatusesResponse, GetProductStatusesResponse } from "../../../api/monday";
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
  onChange: (updated: DomainRules) => void;
  domainMondayStatuses: GetDomainStatusesResponse;
  productMondayStatuses: GetProductStatusesResponse;
}

const DomainRulesTab: React.FC<DomainRulesTabProps> = ({
  domainRules,
  onChange,
  domainMondayStatuses,
  productMondayStatuses
}) => {
  return (
    <RuleContainer>
      <InputGroup>
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

      <InputGroup>
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
