import { css } from "@emotion/react";
import styled from "@emotion/styled";

export const Wrapper = styled.div`
  display: flex;
  gap: 12px;
  /* justify-content: space-between; */
`;

export const DateButton = styled.button<{ selected: boolean }>`
  padding: 10px 16px;
  border-radius: 8px;
  background: ${({ selected }) => (selected ? "#333" : "#222")};
  color: #fff;
  border: 1px solid #555;
  cursor: pointer;
  font-size: 14px;
  position: relative;
  transition: background 0.2s;

  &:hover {
    background: #444;
  }

  ${({ selected }) =>
    selected &&
    css`
      box-shadow: 0 0 0 2px #fff inset;
    `}
`;

export const DatePickerContainer = styled.div<{ top: number; left: number }>`
  position: fixed;
  top: ${({ top }) => top}px;
  left: ${({ left }) => left}px;
  z-index: 1000;
  border-radius: 8px;

  .react-datepicker {
    background-color: #1e1e1e !important;
    border: none !important;
    color: #fff;
    font-size: 14px;
  }

  .react-datepicker__header {
    background-color: #2a2a2a !important;
    border-bottom: none !important;
  }
  .react-datepicker__current-month {
    color: #fff !important;
  }

  .react-datepicker__day,
  .react-datepicker__day-name {
    color: #ddd !important;
    background-color: transparent !important;
    border-radius: 4px;
    transition: background 0.2s;
  }

  .react-datepicker__day--disabled {
    color: #555 !important;
    cursor: not-allowed !important;
    pointer-events: none;
    opacity: 0.4;
  }

  .react-datepicker__day:not(.react-datepicker__day--disabled):hover {
    background-color: #3a3a3a !important;
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--keyboard-selected {
    background-color: #6a4fff !important;
    color: #fff !important;
  }

  .react-datepicker__day--in-range {
    background-color: #444 !important;
    color: #fff !important;
  }

  .react-datepicker__day--range-start,
  .react-datepicker__day--range-end {
    background-color: #6a4fff !important;
    color: #fff !important;
  }

  .react-datepicker__triangle {
    display: none;
  }
`;

export const FieldGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
`;

export const FieldLabel = styled.div`
  font-size: 20px;
  font-weight: 800;
  color: #ccc;
  margin-left: 4px;
`;
