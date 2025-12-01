import React, { useEffect, useState } from "react";
import AdminModal from "../../Common/AdminModal";
import {
  CancelButton,
  ClearDiv,
  ConfirmButton,
  ModalBody,
  StyledInput,
  ActionButton,
  ActionGroup,
  TitleRow,
  SectionLabel,
} from "./CopyAssignmentStrategyModal.styled";
import { DomainStrategy } from "../CopyAssignmentStrategyRulesTab/CopyAssignmentStrategyRulesTab";
import { GetBroadcastDomainsListResponseDto } from "../../../api/broadcast";
import { toastSuccess, toastError } from "../../../helpers/toastify";
import { IoIosSunny } from "react-icons/io";
import { FaDollarSign } from "react-icons/fa";
import { StatusIndicator } from "../CopyAssignmentStrategyRulesTab/CopyAssignmentStrategyRulesTab.styled";

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

interface HistoryEntry {
  id: string;
  timestamp: number;
  description: string;
  snapshot: Record<string, DomainStrategy[]>;
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
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [typeQuantity, setTypeQuantity] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [liveDomains, setLiveDomains] = useState<DomainStrategy[]>([]);
  const [conversionDomains, setConversionDomains] = useState<DomainStrategy[]>([]);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const forceUpdate = () => setUpdateTrigger(prev => prev + 1);

  useEffect(() => {
    const sheet = sheetDomainStatuses.sheets.find(
      (s) => s.sheetName === currentSheet
    );
    if (!sheet) {
      setLiveDomains([]);
      setConversionDomains([]);
      return;
    }
    
    const live = strategiesBySheet[currentSheet]?.filter(
      (s) => sheet.domains.some((d) => d.domainName === s.domain && d.status?.toLowerCase() === "live")
    ) || [];
    
    const conversion = live.filter((s) => s.copiesTypes.includes("conversion"));
    
    setLiveDomains(live);
    setConversionDomains(conversion);
  }, [strategiesBySheet, sheetDomainStatuses, currentSheet, updateTrigger]);

  useEffect(() => {
    if (isOpen && history.length === 0) {
      const initial: HistoryEntry = {
        id: `init-${Date.now()}`,
        timestamp: Date.now(),
        description: "Initial State",
        snapshot: JSON.parse(JSON.stringify(strategiesBySheet)),
      };
      setHistory([initial]);
      setCurrentIndex(0);
    }
  }, [isOpen, strategiesBySheet]);

  const getLiveDomains = () => {
    const sheet = sheetDomainStatuses.sheets.find(
      (s) => s.sheetName === currentSheet
    );
    if (!sheet) return [];
    return strategiesBySheet[currentSheet]?.filter(
      (s) => sheet.domains.some((d) => d.domainName === s.domain && d.status?.toLowerCase() === "live")
    ) || [];
  };

  const getConversionDomains = (list: DomainStrategy[]) =>
    list.filter((s) => s.copiesTypes.includes("conversion"));

  const pushHistory = (
    description: string,
    snapshot: Record<string, DomainStrategy[]>
  ) => {
    const newHistory = [
      ...history.slice(0, currentIndex + 1),
      {
        id: `step-${Date.now()}`,
        timestamp: Date.now(),
        description,
        snapshot: JSON.parse(JSON.stringify(snapshot)),
      },
    ];
    if (newHistory.length > 20) newHistory.shift();
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
    forceUpdate();
  };

  const handleRandomReplace = async () => {
    if (typeQuantity <= 0) return toastError("Enter valid quantity");
    setIsProcessing(true);
    try {
      const live = getLiveDomains();
      const conversion = getConversionDomains(live);
      if (!conversion.length) return toastError("No conversion domains found");

      const shuffled = [...conversion]
        .sort(() => Math.random() - 0.5)
        .slice(0, typeQuantity);
      const updated = JSON.parse(JSON.stringify(strategiesBySheet));
      let count = 0;

      shuffled.forEach((ds) => {
        const idx = updated[currentSheet].findIndex(
          (d: DomainStrategy) => d.domain === ds.domain
        );
        if (idx !== -1) {
          const convIdx = updated[currentSheet][idx].copiesTypes.findIndex(
            (t: string) => t === "conversion"
          );
          if (convIdx !== -1) {
            updated[currentSheet][idx].copiesTypes[convIdx] = "test";
            count++;
          }
        }
      });

      if (count > 0) {
        setStrategiesBySheet(updated);
        pushHistory(`Replaced ${count} conversions with test`, updated);
        toastSuccess(`Replaced ${count} conversion(s)`);
      } else toastError("No replacements made");
    } catch {
      toastError("Error during processing");
    }
    setIsProcessing(false);
  };

  const rollback = () => {
    if (currentIndex > 0) {
      const prev = history[currentIndex - 1];
      setStrategiesBySheet(JSON.parse(JSON.stringify(prev.snapshot)));
      setCurrentIndex(currentIndex - 1);
      forceUpdate();
      toastSuccess(`Rolled back: ${prev.description}`);
    }
  };

  const rollforward = () => {
    if (currentIndex < history.length - 1) {
      const next = history[currentIndex + 1];
      setStrategiesBySheet(JSON.parse(JSON.stringify(next.snapshot)));
      setCurrentIndex(currentIndex + 1);
      forceUpdate();
      toastSuccess(`Rolled forward: ${next.description}`);
    }
  };

  const reset = () => {
    if (history.length) {
      const first = history[0];
      setStrategiesBySheet(JSON.parse(JSON.stringify(first.snapshot)));
      setCurrentIndex(0);
      forceUpdate();
      toastSuccess("Reset to initial state");
    }
  };

  const save = () => {
    toastSuccess("Changes saved");
    onClose();
  };

  return (
    <AdminModal isOpen={isOpen} onClose={onClose}>
      <ModalBody>
        <TitleRow>
          <h3>Random Add Test Strategy – {currentSheet}</h3>
          <StatusIndicator>
            <IoIosSunny /> {liveDomains.length}
          </StatusIndicator>
          <StatusIndicator>
            <FaDollarSign /> {conversionDomains.length}
          </StatusIndicator>
        </TitleRow>

        <SectionLabel>Replace Conversion Types</SectionLabel>
        <ClearDiv>
          <StyledInput
            type="number"
            min={1}
            value={typeQuantity}
            onChange={(e) => setTypeQuantity(parseInt(e.target.value) || 1)}
            disabled={isProcessing}
          />
          <ActionButton onClick={handleRandomReplace} disabled={isProcessing}>
            Replace Randomly
          </ActionButton>
        </ClearDiv>

        <SectionLabel>History</SectionLabel>
        <ActionGroup>
          <ActionButton disabled={currentIndex <= 0} onClick={rollback}>
            ← Rollback
          </ActionButton>
          <ActionButton
            disabled={currentIndex >= history.length - 1}
            onClick={rollforward}
          >
            Rollforward →
          </ActionButton>
          <ActionButton onClick={reset}>Reset</ActionButton>
        </ActionGroup>

        <ActionGroup style={{ justifyContent: "flex-end" }}>
          <CancelButton onClick={onClose}>Cancel</CancelButton>
          <ConfirmButton onClick={save}>Save</ConfirmButton>
        </ActionGroup>
      </ModalBody>
    </AdminModal>
  );
};

export default CopyAssignmentStrategyModal;