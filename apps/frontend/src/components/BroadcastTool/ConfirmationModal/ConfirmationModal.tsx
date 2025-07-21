import React from "react";
import AdminModal from "../../Common/AdminModal";
import styled from "@emotion/styled";

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

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmButtonText: string;
  cancelButtonText: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText,
  cancelButtonText,
}) => {
  return (
    <AdminModal isOpen={isOpen} onClose={onClose}>
      <ModalBody>
        <h3 style={{ margin: 0, fontSize: 22 }}>{title}</h3>
        <p style={{ margin: 0 }}>{message}</p>
        <ModalActions>
          <CancelButton onClick={onClose}>{cancelButtonText}</CancelButton>
          <ConfirmButton onClick={onConfirm}>{confirmButtonText}</ConfirmButton>
        </ModalActions>
      </ModalBody>
    </AdminModal>
  );
};

export default ConfirmationModal;
