import styled from "@emotion/styled";

const DropdownWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 5px;
`;

const OptionTag = styled.div<{ selected: boolean }>`
  background-color: ${({ selected }) => (selected ? "#6a5acd" : "#3a3a3a")};
  color: ${({ selected }) => (selected ? "white" : "#b0b0b0")};
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #6a5acd;
    color: white;
  }
`;

const MultiSelectFromList = ({
  options = [],
  selected = [],
  onChange,
}: {
  options: string[];
  selected: string[];
  onChange: (value: string[]) => void;
}) => {
  const handleSelect = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((s) => s !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <DropdownWrapper>
      <OptionsContainer>
        {options.map((option) => (
          <OptionTag
            key={option}
            selected={selected.includes(option)}
            onClick={() => handleSelect(option)}
          >
            {option}
          </OptionTag>
        ))}
      </OptionsContainer>
    </DropdownWrapper>
  );
};

export default MultiSelectFromList;
