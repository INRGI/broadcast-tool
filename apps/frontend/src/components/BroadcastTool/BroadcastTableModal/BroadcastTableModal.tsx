import React, { useState } from "react";
import AdminModal from "../../Common/AdminModal";
import {
  ApproveButton,
  BackButton,
  ControlsRight,
  CopyBlock,
  CopySpan,
  DomainTd,
  ModalBody,
  TabButton,
  TabControls,
  TabHeader,
  Table,
  TableWrapper,
  Td,
  Th,
} from "./BroadcastTableModal.styled";
import {
  ApproveBroadcastSheetRequest,
  GetAllDomainsResponse,
} from "../../../api/broadcast";
import {
  IoIosArrowRoundBack,
  IoMdCheckmarkCircleOutline,
} from "react-icons/io";
import { toastError, toastSuccess } from "../../../helpers/toastify";
import { approveBroadcast } from "../../../api/broadcast.api";
import Loader from "../../Common/Loader";
import ConfirmationModal from "../ConfirmationModal";
import { BroadcastSendingDay } from "../../../types/broadcast-tool";
import EditCopyCellModal from "../EditCopyCellModal";

interface BroadcastTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  broadcast: GetAllDomainsResponse;
  spreadSheetId: string;
}

const BroadcastTableModal: React.FC<BroadcastTableModalProps> = ({
  isOpen,
  onClose,
  broadcast,
  spreadSheetId,
}) => {
  const [broadcastData, setBroadcastData] = useState(broadcast);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const [editModal, setEditModal] = useState<{
    domain: string;
    date: string;
    entry: BroadcastSendingDay;
  } | null>(null);

  const activeSheet = broadcastData.sheets[activeTabIndex];
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

  const formatDateToMMDD = (date: Date) => {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}/${day}`;
  };

  const handleApproveBroadcast = async () => {
    try {
      setIsLoading(true);
      setIsConfirmationModalOpen(false);
      const data: ApproveBroadcastSheetRequest[] = broadcastData.sheets.map(
        (sheet) => ({
          spreadsheetId: spreadSheetId,
          sheetName: sheet.sheetName,
          broadcast: sheet.domains.map((domain) => ({
            domain: domain.domain,
            esp: domain.esp,
            broadcastCopies: domain.broadcastCopies,
          })),
        })
      );
      const result = await approveBroadcast({
        broadcast: data,
      });
      if (!result.length) {
        setIsLoading(false);
        return toastError("Failed to approve broadcast");
      }

      toastSuccess("Broadcast approved successfully");
      setIsLoading(false);
      onClose();
    } catch (error) {
      toastError("Failed to approve broadcast");
      setIsLoading(false);
    }
  };

  return (
    <AdminModal isOpen={isOpen} onClose={onClose}>
      {isLoading && (
        <ModalBody>
          <Loader />
        </ModalBody>
      )}
      {!isLoading && (
        <ModalBody>
          <TabControls>
            <TabHeader>
              {broadcastData.sheets.map((sheet, index) => (
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
              <ApproveButton onClick={() => setIsConfirmationModalOpen(true)}>
                <IoMdCheckmarkCircleOutline /> Approve
              </ApproveButton>
              <BackButton onClick={() => onClose()}>
                <IoIosArrowRoundBack /> Back
              </BackButton>
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
              </thead>
              <tbody>
                {allDates.map((date) => (
                  <tr key={date}>
                    <DomainTd>{formatDateToMMDD(new Date(date))}</DomainTd>
                    {domains.map((domain) => {
                      const entry = domain.broadcastCopies.find(
                        (c) => c.date === date
                      );

                      return (
                        <Td
                          key={domain.domain + date}
                          isHighlighted={entry?.isModdified}
                          onDoubleClick={() => {
                            if (entry)
                              setEditModal({
                                domain: domain.domain,
                                date,
                                entry,
                              });
                          }}
                        >
                          <CopyBlock>
                            {entry?.copies.map((copy, idx) => (
                              <CopySpan key={idx} bold={copy.isPriority}>
                                {copy.name}
                              </CopySpan>
                            ))}
                          </CopyBlock>
                        </Td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableWrapper>
        </ModalBody>
      )}
      {isConfirmationModalOpen && (
        <ConfirmationModal
          title="Approve Broadcast Changes"
          message="Are you sure you want to approve these changes? (It will make changes in the broadcast google sheet)"
          confirmButtonText="Approve"
          cancelButtonText="Cancel"
          isOpen={isConfirmationModalOpen}
          onClose={() => {
            setIsConfirmationModalOpen(false);
          }}
          onConfirm={handleApproveBroadcast}
        />
      )}
      {editModal && (
        <EditCopyCellModal
          isOpen={true}
          entry={editModal.entry}
          onClose={() => setEditModal(null)}
          onUpdate={(updatedEntry) => {
            const newData = { ...broadcastData };
            const sheet = newData.sheets[activeTabIndex];
            const domainItem = sheet.domains.find(
              (d) => d.domain === editModal.domain
            );
            const entryToUpdate = domainItem?.broadcastCopies.find(
              (c) => c.date === editModal.date
            );
            if (entryToUpdate) {
              Object.assign(entryToUpdate, updatedEntry);
            }
            setBroadcastData(newData);
          }}
        />
      )}
    </AdminModal>
  );
};

export default BroadcastTableModal;
