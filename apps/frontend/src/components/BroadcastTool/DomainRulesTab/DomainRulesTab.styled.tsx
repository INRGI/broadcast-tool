import styled from "@emotion/styled";

export const RuleContainer = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-content: center;
`;

export const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

export const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

export const InputGroup = styled.div<{ disabled?: boolean }>`
  display: flex;
  max-width: 400px;
  align-items: center;
  gap: 10px;
  background-color: #3c3c3c;
  padding: 10px;
  border-radius: 8px;
  border: 2px solid transparent;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  ${(props) =>
    props.disabled &&
    `
      opacity: 0.5;
      pointer-events: none;
      background-color: #666;
    `}
`;

export const InputContainer = styled.div`
  width: 100%;
`;


export const StyledCheckbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  appearance: none;
  border: 2px solid #ccc; 
  border-radius: 4px; 
  background-color: white; 
  position: relative;
  transition: transform 0.2s, background-color 0.3s, border-color 0.3s;

  
  &::before {
    content: '';
    position: absolute;
    left: 3px;
    top: 1px;
    width: 6px; 
    height: 6px; 
    border-left: 2px solid white;
    border-bottom: 2px solid white;
    transform: rotate(-45deg);
    opacity: 0;
    transition: opacity 0.2s;
  }

  &:checked::before {
    opacity: 1; 
  }

  &:checked {
    background-color: #6a5acd; 
    border-color: #6a5acd;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(106, 90, 205, 0.6);
  }

  &:hover {
    transform: scale(1.1); 
  }
`;

export const WhiteSpan = styled.span`
  color: white;
  padding: 0;
  margin: 0;
`;

export const CheckboxWithLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;
