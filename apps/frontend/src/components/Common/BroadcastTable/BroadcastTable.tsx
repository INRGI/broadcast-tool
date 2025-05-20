import React, { useState } from "react";
import { BroadcastDomain } from "../../../types/finance/domain.types";
import {
  Table,
  TableWrapper,
  Td,
  Th,
  DomainTd,
  TabsWrapper,
  TabHeader,
  TabButton,
  TabControls,
  ControlsRight,
  BackButton,
  CopySpan,
  CopyBlock,
  ApproveButton,
} from "./BroadcastTable.styled";
import { GetAllDomainsResponse } from "../../../types/finance/get-all-domains.response";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";

interface BroadcastTableProps {
  data: { sheetName: string; domains: BroadcastDomain[] }[];
  onBack: () => void;
  setBroadcastData: React.Dispatch<
    React.SetStateAction<GetAllDomainsResponse | undefined>
  >;
}

const BroadcastTable: React.FC<BroadcastTableProps> = ({
  data,
  onBack,
  setBroadcastData,
}) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [editingCell, setEditingCell] = useState<{
    domain: string;
    date: string;
  } | null>(null);

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const activeSheet = data[activeTabIndex];
  const domains = activeSheet.domains;

  const allDates = Array.from(
    new Set(domains.flatMap((d) => d.broadcastCopies.map((c) => c.date)))
  ).sort((a, b) => {
    const parseDate = (d: string) => {
      const [m, day] = d.trim().split(/[\/.]/).map(Number);
      return m * 100 + day;
    };
    return parseDate(a) - parseDate(b);
  });

  const handleSave = (domainName: string, date: string, value: string) => {
    setBroadcastData((prev) => {
      if (!prev) return prev;

      const updated = { ...prev };

      for (const sheet of updated.sheets) {
        const domain = sheet.domains.find((d) => d.domain === domainName);
        if (!domain) continue;

        const entry = domain.broadcastCopies.find((c) => c.date === date);
        if (!entry) continue;
        entry.isModdified = true;
        entry.copies = value
          .split(",")
          .map((v) => v.trim())
          .filter((v) => !!v)
          .map((name) => ({ name, isPriority: false }));
      }

      return { ...updated };
    });
  };

  const handleAppove = async () => {
    return;
  };

  const isPastDate = (dateStr: string): boolean => {
    const [month, day] = dateStr.split(/[/.]/).map(Number);
    const today = new Date();
    const cellDate = new Date(today.getFullYear(), month - 1, day);
    return (
      cellDate <
      new Date(today.getFullYear(), today.getMonth(), today.getDate())
    );
  };

  return (
    <TabsWrapper>
      <TabControls>
        <TabHeader>
          {data.map((sheet, index) => (
            <TabButton
              key={sheet.sheetName}
              active={index === activeTabIndex}
              onClick={() => setActiveTabIndex(index)}
            >
              {sheet.sheetName}
            </TabButton>
          ))}
        </TabHeader>
        <ControlsRight>
          <ApproveButton onClick={() => setIsConfirmationModalOpen(true)}>Approve</ApproveButton>
          <BackButton onClick={onBack}>← Back</BackButton>
        </ControlsRight>
      </TabControls>

      <TableWrapper key={activeSheet.sheetName}>
        <Table>
          <thead>
            <tr>
              <Th rotated>Domain</Th>
              {domains.map((domain) => (
                <Th key={domain.domain} rotated>
                  {domain.domain}
                </Th>
              ))}
            </tr>
            <tr>
              <Th>ESP</Th>
              {domains.map((domain) => (
                <Th key={domain.domain + "_esp"}>{domain.esp}</Th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allDates.map((date) => (
              <tr key={date}>
                <DomainTd>{date}</DomainTd>
                {domains.map((domain) => {
                  const entry = domain.broadcastCopies.find(
                    (c) => c.date === date
                  );
                  const isEditing =
                    editingCell?.domain === domain.domain &&
                    editingCell?.date === date;
                  return (
                    <Td
                      key={domain.domain + date}
                      isHighlighted={entry?.isModdified}
                      onDoubleClick={() => {
                        if (!isPastDate(date)) {
                          setEditingCell({ domain: domain.domain, date });
                        }
                      }}
                    >
                      {isEditing ? (
                        <input
                          autoFocus
                          defaultValue={
                            entry?.copies.map((c) => c.name).join(", ") ?? ""
                          }
                          onBlur={(e) => {
                            handleSave(domain.domain, date, e.target.value);
                            setEditingCell(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleSave(
                                domain.domain,
                                date,
                                (e.target as HTMLInputElement).value
                              );
                              setEditingCell(null);
                            }
                          }}
                        />
                      ) : (
                        <CopyBlock>
                          {entry?.copies.map((copy, idx) => (
                            <CopySpan key={idx} bold={copy.isPriority}>
                              {copy.name}
                            </CopySpan>
                          ))}
                        </CopyBlock>
                      )}
                    </Td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrapper>

      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        confirmationText={"Are you sure you want to apply changes?"}
        onSubmit={handleAppove}
      />
    </TabsWrapper>
  );
};

export default BroadcastTable;
