import { TestingRules } from "../../../types/broadcast-tool";
import FloatingLabelNumberInput from "../../Common/FloatingLabelInput/FloatingLabelNumberInput";
import {
  InputContainer,
  InputGroup,
  RuleContainer,
} from "../DomainRulesTab/DomainRulesTab.styled";
import StringArrayEditor from "../StringArrayEditor";

interface TestingRulesTabProps {
  testingRules: TestingRules;
  isPreview?: boolean;
  onChange: (updated: TestingRules) => void;
}

const TestingRulesTab: React.FC<TestingRulesTabProps> = ({
  testingRules,
  isPreview,
  onChange,
}) => {
  return (
    <RuleContainer>
      <InputGroup disabled={isPreview}>
        <StringArrayEditor
          items={testingRules.newTestCopiesGroupNames}
          onChange={(newList) =>
            onChange({
              ...testingRules,
              newTestCopiesGroupNames: newList,
            })
          }
          title="New Test Copies Group Names"
          keyLabel="Group Name"
          keyPlaceholder="Enter group name"
        />
      </InputGroup>

      <InputGroup disabled={isPreview}>
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

      <InputGroup disabled={isPreview}>
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
