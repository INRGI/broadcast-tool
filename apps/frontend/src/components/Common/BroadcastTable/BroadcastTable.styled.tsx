import styled from "@emotion/styled";

export const TabsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
  height: calc(100vh - 40px);
`;

export const TabHeader = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`;

export const TabButton = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  background-color: ${({ active }) => (active ? "#444" : "#2b2b2b")};
  color: #fff;
  border: none;
  border-bottom: 2px solid
    ${({ active }) => (active ? "#00ff88" : "transparent")};
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #3a3a3a;
  }
`;

export const TableWrapper = styled.div`
  max-width: 100%;
  overflow-x: auto;
  max-width: 100%;
`;

export const Table = styled.table`
  border-collapse: collapse;
  background-color: #1e1e1e;
  color: #fff;
  min-width: 800px;
  height: calc(100%);
  max-height: calc(100%);

  thead{
    position: sticky;
    z-index: 2;
  }
`;

export const Th = styled.th<{ rotated?: boolean }>`
  border: 1px solid #444;
  padding: 8px;
  background-color: #333;
  font-weight: bold;
  color: #ddd;
  ${(props) =>
    props.rotated &&
    `
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    white-space: nowrap;
    min-width: 40px;
    vertical-align: center;
  `}
`;

export const Td = styled.td<{ isHighlighted?: boolean }>`
  border: 1px solid #444;
  padding: 6px 8px;
  background-color: ${(props) => (props.isHighlighted ? "#006400" : "#2b2b2b")};
  color: ${(props) => (props.isHighlighted ? "#b2ffb2" : "#ccc")};
  font-size: 14px;
  vertical-align: top;
  text-align: left;
  white-space: pre-wrap;
`;

export const DomainTd = styled.td`
  background-color: #3a3a3a;
  font-weight: bold;
  color: #fff;
  text-align: center;
`;

export const EspHeader = styled.tr`
  background-color: #008000;
  text-align: center;
`;

export const EspCell = styled.td`
  padding: 4px 8px;
  font-size: 14px;
  color: #fff;
  font-weight: bold;
`;
