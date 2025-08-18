import { IgnoringRules } from "../../types/broadcast-tool";
import {
  InputGroup,
  RuleContainer,
} from "../BroadcastTool/DomainRulesTab/DomainRulesTab.styled";
import StringArrayEditor from "../BroadcastTool/StringArrayEditor";

interface ProductRulesTabProps {
  ignoringRules: IgnoringRules;
  onChange: (updated: IgnoringRules) => void;
  isPreview?: boolean;
}

const IgnoringRulesTab: React.FC<ProductRulesTabProps> = ({
  ignoringRules,
  onChange,
  isPreview
}) => {
  return (
    <RuleContainer>
      <InputGroup disabled={isPreview}>
        <StringArrayEditor
          items={ignoringRules.productIndicators}
          onChange={(newList) =>
            onChange({
              ...ignoringRules,
              productIndicators: newList,
            })
          }
          title="Ignore Product Indicators"
          keyLabel="Product Name"
          keyPlaceholder="Enter product name"
        />
      </InputGroup>
    </RuleContainer>
  );
};

export default IgnoringRulesTab;
