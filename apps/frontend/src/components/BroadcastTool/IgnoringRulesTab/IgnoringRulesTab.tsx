import { IgnoringRules } from "../../../types/broadcast-tool";
import {
  InputGroup,
  RuleContainer,
} from "../DomainRulesTab/DomainRulesTab.styled";
import StringArrayEditor from "../StringArrayEditor";

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

      <InputGroup disabled={isPreview}>
        <StringArrayEditor
          items={ignoringRules.broadcasts}
          onChange={(newList) =>
            onChange({
              ...ignoringRules,
              broadcasts: newList,
            })
          }
          title="Ignored Broadcasts"
          keyLabel="Broadcast Name"
          keyPlaceholder="Enter Broadcast name"
        />
      </InputGroup>

      <InputGroup disabled={isPreview}>
        <StringArrayEditor
          items={ignoringRules.broadcastsTabs}
          onChange={(newList) =>
            onChange({
              ...ignoringRules,
              broadcastsTabs: newList,
            })
          }
          title="Ignored Broadcasts Tabs"
          keyLabel="Broadcast Tab Name"
          keyPlaceholder="Enter Broadcast Tab name"
        />
      </InputGroup>
    </RuleContainer>
  );
};

export default IgnoringRulesTab;
