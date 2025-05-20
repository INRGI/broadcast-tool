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

export const TabControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
`;

export const ControlsRight = styled.div`
  display: flex;
  gap: 10px;
`;

export const BackButton = styled.button`
  padding: 6px 12px;
  background-color: #444;
  border: 1px solid #666;
  color: #fff;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #555;
  }
`;

export const ApproveButton = styled.button`
  padding: 6px 12px;
  background-color: #00c41d;
  border: 1px solid #666;
  color: #fff;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #009b17;
  }
`;


export const TableWrapper = styled.div`
  max-width: 100%;
  max-height: calc(100%);
  overflow: auto;
  position: relative;
`;


export const Table = styled.table`
  border-collapse: collapse;
  background-color: #1e1e1e;
  color: #fff;
  min-width: 800px;
  height: calc(100%);
  max-height: calc(100%);
`;

export const Th = styled.th<{ rotated?: boolean }>`
  position: sticky;
  top: 0;
  z-index: 2;
  background-color: #333;
  border: 1px solid #444;
  padding: 8px;
  font-weight: bold;
  color: #ddd;

  ${({ rotated }) =>
    rotated &&
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
  background-color: ${(props) => (props.isHighlighted ? "#f4a61f" : "#2b2b2b")};
  color: ${(props) => (props.isHighlighted ? "#000000" : "#ccc")};
  font-size: 14px;
  text-align: center;
  vertical-align: middle;
`;

export const CopyBlock = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;

  span {
    white-space: nowrap;
    margin: 2px 6px;
  }
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

export const CopySpan = styled.span<{ bold?: boolean }>`
  font-weight: ${({ bold }) => (bold ? "bold" : "normal")};
  margin-right: 6px;
  white-space: nowrap;
`;