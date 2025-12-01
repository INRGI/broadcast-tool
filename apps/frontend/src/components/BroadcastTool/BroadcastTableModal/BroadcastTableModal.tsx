import React, { useState } from "react";
import AdminModal from "../../Common/AdminModal";
import {
  AnalyticWrapper,
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
  MakeBroadcastResponseDto,
} from "../../../api/broadcast";
import {
  IoIosArrowRoundBack,
  IoMdCheckmarkCircleOutline,
} from "react-icons/io";
import { toastError, toastSuccess } from "../../../helpers/toastify";
import { approveBroadcast } from "../../../api/broadcast.api";
import ConfirmationModal from "../ConfirmationModal";
import { BroadcastSendingDay } from "../../../types/broadcast-tool";
import EditCopyCellModal from "../EditCopyCellModal";
import CatLoader from "../../Common/Loader/CatLoader";
import BroadcastSendsAnalytics from "../BroadcastSendsAnalytics";

interface BroadcastTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  broadcast: MakeBroadcastResponseDto;
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

  const activeSheet = broadcastData.sheets[activeTabIndex - 1];
  const domains = activeSheet?.domains || [];

  const allDates = Array.from(
    new Set(domains.flatMap((d) => d.broadcastCopies.map((c) => c.date)))
  ).sort((a, b) => {
    const parseDate = (d: string) => {
      const [year, month, day] = d.trim().split(/[-/.]/).map(Number);
      return year * 10000 + month * 100 + day;
    };
    return parseDate(a) - parseDate(b);
  });

  const formatDateToMMDD = (date: string) => {
    const [year, month, day] = date.split("-");
    const formattedDate = `${month}/${day}`;
    return formattedDate;
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
    } catch  {
      toastError("Failed to approve broadcast");
      setIsLoading(false);
    }
  };

  const handleChangeIsModdified = (
    sheet: string,
    domain: string,
    date: string
  ) => {
    setBroadcastData({
      ...broadcastData,
      sheets: broadcastData.sheets.map((s) => {
        if (s.sheetName === sheet)
          return {
            ...s,
            domains: s.domains.map((d) => {
              if (d.domain === domain)
                return {
                  ...d,
                  broadcastCopies: d.broadcastCopies.map((c) => {
                    if (c.date === date && d.domain === domain) {
                      return {
                        ...c,
                        isModdified: !c.isModdified,
                      };
                    }
                    return c;
                  }),
                };
              return d;
            }),
          };
        return s;
      }),
    });
  };

  return (
    <AdminModal isOpen={isOpen} onClose={onClose}>
      {isLoading && (
        <ModalBody>
          <CatLoader />
        </ModalBody>
      )}
      {!isLoading && (
        <ModalBody>
          <TabControls>
            <TabHeader>
              <TabButton
                key={broadcastData.calculatedChanges.name}
                active={activeTabIndex === 0}
                onClick={() => setActiveTabIndex(0)}
              >
                Stats
              </TabButton>
              {broadcastData.sheets.map((sheet, index) => (
                <TabButton
                  key={sheet.sheetName}
                  active={index === activeTabIndex - 1}
                  onClick={() => setActiveTabIndex(index + 1)}
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
          {activeTabIndex === 0 && (
            <AnalyticWrapper>
            <BroadcastSendsAnalytics
              data={{
                broadcasts: [broadcastData.calculatedChanges],
              }}
            />
            </AnalyticWrapper>
          )}
          {activeTabIndex !== 0 && (
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
                      <DomainTd>{formatDateToMMDD(date)}</DomainTd>
                      {domains.map((domain) => {
                        const entry = domain.broadcastCopies.find(
                          (c) => c.date === date
                        );

                        return (
                          <Td
                            key={domain.domain + date}
                            isHighlighted={entry?.isModdified}
                            onContextMenu={(e) => {
                              e.preventDefault();
                              handleChangeIsModdified(
                                activeSheet.sheetName,
                                domain.domain,
                                date
                              );
                            }}
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
          )}
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
            const sheet = newData.sheets[activeTabIndex - 1];
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
