import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import {
  DateButton,
  DatePickerContainer,
  Wrapper,
  FieldLabel,
  FieldGroup,
} from "./DateRangeSelector.styled";

const MIN_DATE = new Date();
const MAX_SELECTION_DAYS = 5;

export const DateRangeSelector = ({
  onDateRangeChange,
}: {
  onDateRangeChange: (dates: [Date | null, Date | null]) => void;
}) => {
  const [openPickerFor, setOpenPickerFor] = useState<"start" | "end" | null>(
    null
  );
  const [dates, setDates] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dates;
  const startRef = useRef<HTMLButtonElement>(null);
  const endRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const handleDateChange = (date: Date | null) => {
    if (!date) return;

    if (openPickerFor === "start") {
      setDates([date, null]);
      onDateRangeChange([date, null]);
      setOpenPickerFor(null);
    } else if (openPickerFor === "end" && startDate) {
      const diffDays =
        (date.getTime() - startDate.getTime()) / (1000 * 3600 * 24) + 1;
      if (diffDays > MAX_SELECTION_DAYS || date < startDate) return;
      const endWithTime = new Date(date.setHours(23, 59, 59, 999));
      setDates([startDate, endWithTime]);
      onDateRangeChange([startDate, endWithTime]);
      setOpenPickerFor(null);
    }
  };

  useEffect(() => {
    const ref = openPickerFor === "start" ? startRef : endRef;
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setPosition({ top: rect.bottom + 6, left: rect.left });
    }
  }, [openPickerFor]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenPickerFor(null);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const pickerEl = document.querySelector(".react-datepicker");
      if (
        pickerEl &&
        !pickerEl.contains(event.target as Node) &&
        !startRef.current?.contains(event.target as Node) &&
        !endRef.current?.contains(event.target as Node)
      ) {
        setOpenPickerFor(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Wrapper>
      <FieldGroup>
        <FieldLabel>From Date</FieldLabel>
        <DateButton
          ref={startRef}
          selected={!!startDate}
          onClick={() => setOpenPickerFor("start")}
        >
          {startDate ? startDate.toLocaleDateString() : <FaCalendarAlt />}
        </DateButton>
      </FieldGroup>

      {startDate && (
        <FieldGroup>
          <FieldLabel>To Date</FieldLabel>
          <DateButton
            ref={endRef}
            selected={!!endDate}
            onClick={() => startDate && setOpenPickerFor("end")}
            disabled={!startDate}
          >
            {endDate ? endDate.toLocaleDateString() : <FaCalendarAlt />}
          </DateButton>
        </FieldGroup>
      )}

      {openPickerFor && (
        <DatePickerContainer top={position.top} left={position.left}>
          <DatePicker
            inline
            selected={openPickerFor === "start" ? startDate : endDate}
            onChange={handleDateChange}
            minDate={
              openPickerFor === "start" ? MIN_DATE : startDate || MIN_DATE
            }
            maxDate={
              openPickerFor === "end" && startDate
                ? new Date(
                    startDate.getTime() + (MAX_SELECTION_DAYS - 1) * 86400000
                  )
                : undefined
            }
          />
        </DatePickerContainer>
      )}
    </Wrapper>
  );
};
