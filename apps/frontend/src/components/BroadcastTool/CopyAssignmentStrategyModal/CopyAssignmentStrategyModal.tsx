import React, { useEffect, useState } from "react";
import AdminModal from "../../Common/AdminModal";
import { ModalBody } from "./CopyAssignmentStrategyModal.styled";
import { DomainStrategy } from "../CopyAssignmentStrategyRulesTab/CopyAssignmentStrategyRulesTab";
import { GetBroadcastDomainsListResponseDto } from "../../../api/broadcast";

interface CopyAssignmentStrategyModalProps {
  isOpen: boolean;
  currentSheet: string;
  onClose: () => void;
  strategiesBySheet: Record<string, DomainStrategy[]>;
  setStrategiesBySheet: React.Dispatch<
    React.SetStateAction<Record<string, DomainStrategy[]>>
  >;
  sheetDomainStatuses: GetBroadcastDomainsListResponseDto;
}

const CopyAssignmentStrategyModal: React.FC<
  CopyAssignmentStrategyModalProps
> = ({
  isOpen,
  onClose,
  strategiesBySheet,
  setStrategiesBySheet,
  currentSheet,
  sheetDomainStatuses,
}) => {
  const [history, setHistory] = useState<Record<string, DomainStrategy[]>>({});
  const [typeQuantity, setTypeQuantity] = useState<number>(0);

  useEffect(() => {
    setHistory(strategiesBySheet);
  }, [strategiesBySheet]);

  const handleReset = () => {
    setHistory(strategiesBySheet);
  };

  const handleRollback = () => {
    return
  };

  const handleRollforward = () => {
    return;
  };

  const handleSave = () => {
    return;
  };

  const handleAddRandomly = () => {
    return;
  };

  return (
    <AdminModal isOpen={isOpen} onClose={onClose}>
      <ModalBody></ModalBody>
    </AdminModal>
  );
};

export default CopyAssignmentStrategyModal;
