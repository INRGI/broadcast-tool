import styled from "@emotion/styled";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import SearchInput from "../SearchInput/SearchInput";

const DropdownWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const DropdownContainer = styled.div`
  position: relative;
  width: 100%;
`;

const DropdownButton = styled.button`
  width: 100%;
  padding: 15px;
  padding-top: 20px;
  border: 1px solid #4f4f4f;
  border-radius: 8px;
  font-size: 16px;
  background-color: #2b2b2b;
  color: #f0f0f0;
  transition: border-color 0.3s, box-shadow 0.3s;
  text-align: left;
  cursor: pointer;
  position: relative;

  &:focus {
    border-color: #6a5acd;
    box-shadow: 0 0 8px rgba(106, 90, 205, 0.5);
    outline: none;
  }
`;

const FloatingLabel = styled.span<{ active: boolean }>`
  position: absolute;
  top: ${({ active }) => (active ? "-8px" : "50%")};
  left: 15px;
  transform: translateY(${({ active }) => (active ? "0" : "-50%")});
  font-size: ${({ active }) => (active ? "12px" : "16px")};
  color: ${({ active }) => (active ? "#6a5acd" : "#b0b0b0")};
  pointer-events: none;
  background-color: #2b2b2b;
  padding: 0 5px;
  transition: all 0.3s ease;
  z-index: 1;
  border: ${({ active }) => (active ? "1px solid #6a5acd" : "none")};
  border-radius: 4px;
`;

const DropdownList = styled.ul`
  position: absolute;
  width: 100%;
  background-color: #2b2b2b;
  border: 1px solid #4f4f4f;
  border-radius: 8px;
  padding: 0;
  list-style: none;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 9999;
`;

const DropdownItem = styled.li`
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
  color: #f0f0f0;

  &:hover {
    background-color: #6a5acd;
  }
`;

const Dropdown = ({
  options,
  selected,
  onSelect,
  placeholder,
}: {
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
  placeholder: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownListRef = useRef<HTMLUListElement | null>(null);

  const hasValue = selected !== "";
  const showFloatingLabel = isFocused || hasValue;

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
    setIsFocused(true);
  };

  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as Node;
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(target) &&
      dropdownListRef.current &&
      !dropdownListRef.current.contains(target)
    ) {
      setIsOpen(false);
    }
  };

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!dropdownRef.current || !dropdownListRef.current || !isOpen) return;
    const buttonRect = dropdownRef.current.getBoundingClientRect();
    dropdownListRef.current.style.position = "absolute";
    dropdownListRef.current.style.top = `${buttonRect.bottom + window.scrollY}px`;
    dropdownListRef.current.style.left = `${buttonRect.left + window.scrollX}px`;
    dropdownListRef.current.style.width = `${buttonRect.width}px`;
  }, [isOpen]);

  const renderDropdown = (
    <DropdownList ref={dropdownListRef}>
      <SearchInput
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {filteredOptions.map((option) => (
        <DropdownItem key={option} onClick={() => {
          onSelect(option);
          setIsOpen(false);
        }}>
          {option}
        </DropdownItem>
      ))}
    </DropdownList>
  );

  return (
    <DropdownWrapper ref={dropdownRef}>
      <DropdownContainer>
        <FloatingLabel active={showFloatingLabel}>{placeholder}</FloatingLabel>
        <DropdownButton onClick={handleButtonClick}>
          {hasValue ? selected : ""}
        </DropdownButton>
      </DropdownContainer>
      {isOpen && createPortal(renderDropdown, document.body)}
    </DropdownWrapper>
  );
};

export default Dropdown;