import styled from "@emotion/styled";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 500px;
  max-width: 500px;
  width: 100%;
  gap: 20px;
  background-color: #181818;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.4);
  justify-content: center;
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
  justify-content: space-between;
  align-content: center;
`;

export const ConfirmationText = styled.h3`
  padding: 0;
  margin: 0;
  color: white;
  font-weight: 600;
  font-size: 20px;
  text-align: center;
`;

export const CancelButton = styled.button`
  align-items: center;
  appearance: none;
  background-color: #e63946;
  border-radius: 4px;
  border-width: 0;
  box-shadow: rgba(45, 35, 66, 0.4) 0 2px 4px,
    rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #b22b36 0 -3px 0 inset;
  box-sizing: border-box;
  color: white;
  cursor: pointer;
  display: inline-flex;
  font-family: "JetBrains Mono", monospace;
  height: 48px;
  justify-content: center;
  line-height: 1;
  list-style: none;
  overflow: hidden;
  padding-left: 5px;
  padding-right: 5px;
  position: relative;
  text-align: left;
  text-decoration: none;
  transition: box-shadow 0.15s, transform 0.15s;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  white-space: nowrap;
  will-change: box-shadow, transform;
  font-size: 18px;
  width: 150px;
  &:focus {
    box-shadow: #b22b36 0 0 0 1.5px inset, rgba(45, 35, 66, 0.4) 0 2px 4px,
      rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #b22b36 0 -3px 0 inset;
  }

  &:hover {
    box-shadow: rgba(45, 35, 66, 0.4) 0 4px 8px,
      rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #b22b36 0 -3px 0 inset;
    transform: translateY(-2px);
  }

  &:active {
    box-shadow: #b22b36 0 3px 7px inset;
    transform: translateY(2px);
  }
`;

export const SubmitButton = styled(CancelButton)`
  background-color: #6fcd5a;
  box-shadow: rgba(45, 35, 66, 0.4) 0 2px 4px,
    rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #63b750 0 -3px 0 inset;

  &:focus {
    box-shadow: #63b750 0 0 0 1.5px inset, rgba(45, 35, 66, 0.4) 0 2px 4px,
      rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #63b750 0 -3px 0 inset;
  }

  &:hover {
    box-shadow: rgba(45, 35, 66, 0.4) 0 4px 8px,
      rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #63b750 0 -3px 0 inset;
  }

  &:active {
    box-shadow: #63b750 0 3px 7px inset;
  }
`;
