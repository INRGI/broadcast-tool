import { TestingRules } from "../../../types/broadcast-tool";
import FloatingLabelNumberInput from "../../Common/FloatingLabelInput/FloatingLabelNumberInput";
import {
  InputContainer,
  InputGroup,
  RuleContainer,
} from "../DomainRulesTab/DomainRulesTab.styled";

interface TestingRulesTabProps {
  testingRules: TestingRules;
  onChange: (updated: TestingRules) => void;
}

const TestingRulesTab: React.FC<TestingRulesTabProps> = ({
    testingRules,
  onChange,
}) => {
  return (
    <RuleContainer>
      <InputGroup>
        <InputContainer>
          <FloatingLabelNumberInput
            placeholder="Max Sends To Be Test Copy"
            value={Number(testingRules.maxSendsToBeTestCopy)}
            onChange={(e) =>
              onChange({
                ...testingRules,
                maxSendsToBeTestCopy: Number(e.target.value),
              })
            }
          />
        </InputContainer>
      </InputGroup>

      <InputGroup>
        <InputContainer>
          <FloatingLabelNumberInput
            placeholder="Similar Test Copy Limit Per Day"
            value={Number(testingRules.similarTestCopyLimitPerDay)}
            onChange={(e) =>
              onChange({
                ...testingRules,
                similarTestCopyLimitPerDay: Number(e.target.value),
              })
            }
          />
        </InputContainer>
      </InputGroup>
    </RuleContainer>
  );
};

export default TestingRulesTab;
