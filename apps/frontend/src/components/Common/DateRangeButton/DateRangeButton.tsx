/* eslint-disable react/jsx-no-useless-fragment */
import { useEffect, useRef, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { FaCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const MAX_SELECTION_DAYS = 3;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const DateButton = styled.button<{ active: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 20px;
  transition: all 0.3s ease;
  border: none;
  position: relative;

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  ${({ active }) =>
    active &&
    css`
      &::after {
        content: "";
        position: absolute;
        width: 50px;
        height: 50px;
        border: 2px solid #fff;
        border-radius: 50%;
        animation: ${rotate} 2s linear infinite;
      }
    `}
`;

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const DatePickerContainer = styled.div<{ top: number; left: number }>`
  position: fixed;
  top: ${({ top }) => top}px;
  left: ${({ left }) => left}px;
  z-index: 9999;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
`;

export const DateRangeButton = ({
  onDateRangeChange,
}: {
  onDateRangeChange: (dates: [Date | null, Date | null]) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [dates, setDates] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dates;
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const handleChange = (update: [Date | null, Date | null]) => {
    const [start, end] = update;
  
    if (start && !end) {
      setDates([start, null]);
      onDateRangeChange([start, null]);
      return;
    }
  
    if (start && end && end.getTime() < start.getTime()) return;
  
    const diffInDays =
      start && end
        ? (end.getTime() - start.getTime()) / (1000 * 3600 * 24) + 1
        : 0;
    if (diffInDays > MAX_SELECTION_DAYS) return;
  
    const inclusiveEnd = end
      ? new Date(end.setHours(23, 59, 59, 999))
      : null;
  
    setDates([start, end]);
    onDateRangeChange([start, inclusiveEnd]);
  
    if (start && end) setOpen(false);
  };
  

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (open && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8,
        left: rect.left - 280,
      });
    }
  }, [open]);

  const isActive = !!startDate;

  return (
    <Wrapper>
      <DateButton
        ref={ref}
        active={isActive}
        onClick={() => setOpen((prev) => !prev)}
      >
        <FaCalendarAlt />
      </DateButton>
      {open && (
        <DatePickerContainer top={position.top} left={position.left}>
          <DatePicker
            selected={startDate}
            onChange={handleChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            shouldCloseOnSelect={false}
            minDate={new Date()}
            maxDate={
              startDate
                ? new Date(
                    startDate.getTime() + (MAX_SELECTION_DAYS - 1) * 86400000
                  )
                : undefined
            }
            inline
          />
        </DatePickerContainer>
      )}
    </Wrapper>
  );
};
