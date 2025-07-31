import { AnalyticSelectionRules } from "../../../types/broadcast-tool";
import FloatingLabelNumberInput from "../../Common/FloatingLabelInput/FloatingLabelNumberInput";
import {
  InputContainer,
  InputGroup,
  RuleContainer,
} from "../DomainRulesTab/DomainRulesTab.styled";

interface AnalyticSelectionRulesTabProps {
  analyticSelectionRules: AnalyticSelectionRules;
  isPreview?: boolean;
  onChange: (updated: AnalyticSelectionRules) => void;
}

const AnalyticSelectionRulesTab: React.FC<AnalyticSelectionRulesTabProps> = ({
  analyticSelectionRules,
  onChange,
  isPreview,
}) => {
  return (
    <RuleContainer>
      <InputGroup disabled={isPreview}>
        <InputContainer>
          <FloatingLabelNumberInput
            placeholder="Days Interval For Clickable Copies"
            value={analyticSelectionRules.clickableCopiesDaysInterval}
            onChange={(e) =>
              onChange({
                ...analyticSelectionRules,
                clickableCopiesDaysInterval: Number(e.target.value),
              })
            }
          />
        </InputContainer>
      </InputGroup>
      <InputGroup disabled={isPreview}>
        <InputContainer>
          <FloatingLabelNumberInput
            placeholder="Days Interval For Convertible Copies"
            value={Number(analyticSelectionRules.convertibleCopiesDaysInterval)}
            onChange={(e) =>
              onChange({
                ...analyticSelectionRules,
                convertibleCopiesDaysInterval: Number(e.target.value),
              })
            }
          />
        </InputContainer>
      </InputGroup>

      <InputGroup disabled={isPreview}>
        <InputContainer>
          <FloatingLabelNumberInput
            placeholder="Days Interval For Warm Up Copies"
            value={Number(analyticSelectionRules.warmUpCopiesDaysInterval)}
            onChange={(e) =>
              onChange({
                ...analyticSelectionRules,
                warmUpCopiesDaysInterval: Number(e.target.value),
              })
            }
          />
        </InputContainer>
      </InputGroup>

      <InputGroup disabled={isPreview}>
        <InputContainer>
          <FloatingLabelNumberInput
            placeholder="Days Interval For Test Copies"
            value={Number(analyticSelectionRules.testCopiesDaysInterval)}
            onChange={(e) =>
              onChange({
                ...analyticSelectionRules,
                testCopiesDaysInterval: Number(e.target.value),
              })
            }
          />
        </InputContainer>
      </InputGroup>

      <InputGroup disabled={isPreview}>
        <InputContainer>
          <FloatingLabelNumberInput
            placeholder="Days Interval For Domain Revenue"
            value={Number(analyticSelectionRules.domainRevenueDaysInterval)}
            onChange={(e) =>
              onChange({
                ...analyticSelectionRules,
                domainRevenueDaysInterval: Number(e.target.value),
              })
            }
          />
        </InputContainer>
      </InputGroup>
    </RuleContainer>
  );
};

export default AnalyticSelectionRulesTab;
