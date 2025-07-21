import React, { useState } from "react";
import AdminModal from "../../Common/AdminModal";
import {
  ModalWrapper,
  Section,
  SectionTitle,
  CopyRow,
  CopyName,
  ActionButton,
} from "./EditCopyCellModal.styled";
import {
  BroadcastSendingDay,
  BroadcastCopy,
} from "../../../types/broadcast-tool";
import { CopyType } from "../../../types/broadcast-tool/copy-type.enum";
import { MdDeleteForever } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { TfiLoop } from "react-icons/tfi";

interface EditCopyModalProps {
  isOpen: boolean;
  entry: BroadcastSendingDay;
  onClose: () => void;
  onUpdate: (updated: BroadcastSendingDay) => void;
}

const EditCopyCellModal: React.FC<EditCopyModalProps> = ({
  isOpen,
  entry,
  onClose,
  onUpdate,
}) => {
  const [manualCopyName, setManualCopyName] = useState("");

  const handleRemove = (name: string) => {
    const updated = {
      ...entry,
      copies: entry.copies.filter((c) => c.name !== name),
      isModdified: true,
    };
    onUpdate(updated);
  };

  const handleAdd = (copy: BroadcastCopy) => {
    const updated = {
      ...entry,
      copies: [...entry.copies, copy],
      isModdified: true,
    };
    onUpdate(updated);
  };

  const handleManualAdd = () => {
    const trimmed = manualCopyName.trim();
    if (!trimmed) return;
    const copy: BroadcastCopy = {
      name: trimmed,
      isPriority: false,
      copyType: CopyType.Unknown,
    };
    handleAdd(copy);
    setManualCopyName("");
  };

  const groupedByType: Record<CopyType, BroadcastCopy[]> = {
    [CopyType.Click]: [],
    [CopyType.Conversion]: [],
    [CopyType.Test]: [],
    [CopyType.Warmup]: [],
    [CopyType.Unknown]: [],
  };

  entry.possibleReplacementCopies?.forEach((copy) => {
    groupedByType[copy.copyType || CopyType.Unknown].push(copy);
  });

  return (
    <AdminModal isOpen={isOpen} onClose={onClose}>
      <ModalWrapper>
        <Section>
          <SectionTitle>Current Copies for {entry.date}</SectionTitle>
          {entry.copies.length > 0 ? (
            entry.copies.map((c) => (
              <CopyRow key={c.name}>
                <CopyName>
                  {c.name} <span style={{ opacity: 0.6 }}>({c.copyType})</span>
                </CopyName>
                <ActionButton onClick={() => handleRemove(c.name)}>
                  <MdDeleteForever /> Remove
                </ActionButton>
              </CopyRow>
            ))
          ) : (
            <p style={{ color: "#888" }}>No copies assigned yet.</p>
          )}
        </Section>

        <Section>
          <SectionTitle>
            <TfiLoop /> Possible Replacement Copies
          </SectionTitle>
          {Object.entries(groupedByType).map(([type, copies]) => {
            if (copies.length === 0) return null;
            return (
              <div key={type}>
                <p style={{ fontSize: 13, marginBottom: 4, color: "#aaa" }}>
                  {type}
                </p>
                {copies.map((c) => {
                  if (entry.copies.some((c2) => c2.name.includes(c.name))) return null;
                  return (
                  <CopyRow key={c.name}>
                    <CopyName>{c.name}</CopyName>
                    <ActionButton onClick={() => handleAdd(c)}>
                      <IoMdAdd /> Add
                    </ActionButton>
                  </CopyRow>
                )})}
              </div>
            );
          })}

          {entry.possibleReplacementCopies.length === 0 && (
            <p style={{ color: "#888" }}>No possible replacements available.</p>
          )}
        </Section>

        <Section>
          <SectionTitle>Add Copy Manually</SectionTitle>
          <CopyRow>
            <input
              type="text"
              placeholder="Enter copy name"
              value={manualCopyName}
              onChange={(e) => setManualCopyName(e.target.value)}
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #444",
                backgroundColor: "#2b2b2b",
                color: "white",
              }}
            />
            <ActionButton onClick={handleManualAdd}>
              <IoMdAdd /> Add
            </ActionButton>
          </CopyRow>
        </Section>
      </ModalWrapper>
    </AdminModal>
  );
};

export default EditCopyCellModal;
