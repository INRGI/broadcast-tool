import React, { useState } from "react";
import AdminModal from "../../Common/AdminModal";
import styled from "@emotion/styled";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toastError } from "../../../helpers/toastify";

const ModalBody = styled.div`
  background-color: #181818;
  padding: 25px;
  border-radius: 10px;
  width: 500px;
  max-width: 100%;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const ConfirmButton = styled.button`
  padding: 10px 18px;
  background-color: #6a5acd;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.1s;

  &:hover {
    background-color: #5941a9;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const CancelButton = styled.button`
  padding: 10px 18px;
  background-color: #444;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #666;
  }
`;

const StyledDatePicker = styled(DatePicker as any)`
  background-color: #2b2b2b;
  color: white;
  border: 1px solid #4f4f4f;
  padding: 10px;
  border-radius: 8px;
  width: 100%;
  font-size: 14px;

  .react-datepicker__triangle {
    display: none;
  }

  .react-datepicker {
    background-color: #2b2b2b;
    border-color: #4f4f4f;
    color: white;
  }

  .react-datepicker__day--selected {
    background-color: #6a5acd;
  }

  .react-datepicker__header {
    background-color: #1f1f1f;
    border-bottom: 1px solid #4f4f4f;
  }

  .react-datepicker__day {
    color: white;
  }
`;

const DateContainer = styled.div`
  padding: 0;
  margin: 0;
  display: flex;
  width: 100%;
  gap: 20px;
  align-items: center;
`;

const Label = styled.label`
  font-size: 14px;
  color: #ccc;
`;

interface AnalyticsLaunchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (fromDate: Date, toDate: Date) => void;
}

const AnalyticsLaunchModal: React.FC<AnalyticsLaunchModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);

  const handleSubmit = async () => {
    if (!fromDate || !toDate) return toastError("Please select both dates");
    if (fromDate > toDate)
      return toastError("'From' date must be before 'To' date");
    try {
      onSubmit(fromDate, toDate);
    } catch  {
      return toastError("'From' date must be before 'To' date");
    }
  };

  return (
    <AdminModal isOpen={isOpen} onClose={onClose}>
      <ModalBody>
        <>
          <h3 style={{ margin: 0, fontSize: 22 }}>Calculate Broadcast Sends</h3>

          <DateContainer>
            <Label>From Date</Label>
            <StyledDatePicker
              selected={fromDate}
              onChange={(date: React.SetStateAction<Date | null>) =>
                setFromDate(date)
              }
              dateFormat="yyyy-MM-dd"
              placeholderText="Select start date"
            />
          </DateContainer>

          <DateContainer>
            <Label>To Date</Label>
            <StyledDatePicker
              selected={toDate}
              onChange={(date: React.SetStateAction<Date | null>) =>
                setToDate(date)
              }
              minDate={fromDate}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select end date"
            />
          </DateContainer>

          <ModalActions>
            <CancelButton onClick={onClose}>Cancel</CancelButton>
            <ConfirmButton onClick={handleSubmit}>Calculate</ConfirmButton>
          </ModalActions>
        </>
      </ModalBody>
    </AdminModal>
  );
};

export default AnalyticsLaunchModal;
