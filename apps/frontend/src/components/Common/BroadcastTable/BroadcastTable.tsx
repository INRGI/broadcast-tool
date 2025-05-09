import React, { useState } from "react";
import { BroadcastDomain } from "../../../types/finance/domain.types";
import { Table, TableWrapper, Td, Th, DomainTd, TabsWrapper, TabHeader, TabButton } from "./BroadcastTable.styled";

interface BroadcastTableProps {
  data: { sheetName: string; domains: BroadcastDomain[] }[];
}

const BroadcastTable: React.FC<BroadcastTableProps> = ({ data }) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
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
  

  return (
    <TabsWrapper>
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

      <TableWrapper key={activeSheet.sheetName}>
        <Table>
          <thead>
            <tr>
              <Th rotated>Domain</Th>
              {domains.map((domain) => (
                <Th key={domain.domain} rotated>{domain.domain}</Th>
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
                  const entry = domain.broadcastCopies.find((c) => c.date === date);
                  return (
                    <Td key={domain.domain + date} isHighlighted={!!entry}>
                      {entry ? entry.copies.join("\n") : ""}
                    </Td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrapper>
    </TabsWrapper>
  );
};

export default BroadcastTable;
