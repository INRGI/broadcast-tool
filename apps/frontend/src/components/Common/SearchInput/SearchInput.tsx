import styled from "@emotion/styled";
import React, { useState } from "react";

const InputWrapper = styled.div`
  position: relative;
  width: calc(100% - 32px);
`;
const StyledLabel = styled.label<{ isFocused: boolean }>`
  position: absolute;
  top: ${({ isFocused }) => (isFocused ? "-8px" : "50%")};
  left: 15px;
  transform: translateY(${({ isFocused }) => (isFocused ? "0" : "-50%")});
  font-size: ${({ isFocused }) => (isFocused ? "12px" : "16px")};
  color: ${({ isFocused }) => (isFocused ? "#6a5acd" : "#b0b0b0")};
  pointer-events: none;
  background-color: #2b2b2b;
  padding: 0 5px;
  transition: all 0.3s ease;
  border: ${({ isFocused }) => (isFocused ? "1px solid #6a5acd" : "none")};
  border-radius: 4px;
`;


const StyledInput = styled.input`
  width: 100%;
  padding: 15px;
  padding-top: 20px;
  border: 1px solid #4f4f4f;
  border-radius: 8px;
  font-size: 16px;
  background-color: #2b2b2b;
  color: #f0f0f0;
  transition: border-color 0.3s, box-shadow 0.3s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:focus {
    border-color: #6a5acd;
    box-shadow: 0 0 8px rgba(106, 90, 205, 0.5);
    outline: none;
  }
`;

const SearchInput = ({
  value,
  onChange,
  placeholder,
}: {
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(value !== "");

  return (
    <InputWrapper>
      <StyledLabel isFocused={isFocused || value !== ""}>{placeholder}</StyledLabel>
      <StyledInput
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        required
      />
    </InputWrapper>
  );
};

export default SearchInput;
