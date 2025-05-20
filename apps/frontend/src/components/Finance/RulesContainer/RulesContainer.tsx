import React from "react";
import { FaTrash, FaPlus } from "react-icons/fa";
import {
  Button,
  Container,
  IconButton,
  Input,
  RuleRow,
  Select,
} from "./RulesContainer.styled";

export interface Rule {
  product: string;
  condition: string;
  value: string;
}

interface Props {
  rules: Rule[];
  setRules: React.Dispatch<React.SetStateAction<Rule[]>>;
}

export const RulesContainer: React.FC<Props> = ({ rules, setRules }) => {
  const addRule = () => {
    setRules([...rules, { product: "", condition: "not_more", value: "" }]);
  };

  const updateRule = (index: number, key: keyof Rule, value: string) => {
    const updated = [...rules];
    updated[index][key] = value;
    setRules(updated);
  };

  const removeRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  return (
    <Container>
      {rules.map((rule, index) => (
        <RuleRow key={index}>
          <Input
            placeholder="product name"
            value={rule.product}
            onChange={(e) => updateRule(index, "product", e.target.value)}
          />
          <Select
            value={rule.condition}
            onChange={(e) => updateRule(index, "condition", e.target.value)}
          >
            <option value="not_more">Not More</option>
            <option value="not_less">Not Less</option>
          </Select>
          <Input
            type="number"
            placeholder="quantity"
            value={rule.value}
            onChange={(e) => updateRule(index, "value", e.target.value)}
          />
          <IconButton onClick={() => removeRule(index)} title="Delete">
            <FaTrash />
          </IconButton>
        </RuleRow>
      ))}

      <Button onClick={addRule}>
        <FaPlus /> Add Limits
      </Button>
    </Container>
  );
};
