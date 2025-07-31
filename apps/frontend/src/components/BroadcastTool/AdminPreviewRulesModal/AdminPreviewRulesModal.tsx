import React from "react";
import AdminModal from "../../Common/AdminModal";
import { ModalBody } from "./AdminPreviewRulesModal.styled";
import AdminRules from "../AdminRules";

interface AdminPreviewRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminPreviewRulesModal: React.FC<AdminPreviewRulesModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <AdminModal isOpen={isOpen} onClose={onClose}>
      <ModalBody>
      <AdminRules isPreview={true}/>
      </ModalBody>
    </AdminModal>
  );
};

export default AdminPreviewRulesModal;
