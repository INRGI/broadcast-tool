import styled from "@emotion/styled";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: #3a3a3a;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.4);
  max-width: calc(100%);
  width: 100%;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

export const ButtonsHeaderContainer = styled.div`
  display: flex;
  gap: 10px;
`;

export const ListScrollContainer = styled.div`
  width: calc(100%);
  flex-direction: column;
  overflow-x: hidden;
  height: auto;
  max-height: calc(100vh - 160px);
  overflow-y: auto;
  display: flex;
  gap: 20px;
`;

export const Section = styled.div`
  background-color: #1f1f1f;
  border: 1px solid #4f4f4f;
  width: calc(100%);
  border-radius: 8px;
`;

export const SectionHeader = styled.button<{ active: boolean }>`
  width: 100%;
  text-align: left;
  padding: 16px;
  border-radius: 8px;
  background-color: ${({ active }) => (active ? "#2b2b2b" : "#232323")};
  color: white;
  border: none;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: background-color 0.3s;

  &:hover {
    background-color: #333;
  }
`;
export const SectionInner = styled.div`
  padding: 16px;
  background-color: #2b2b2b;
  color: white;
`;

export const SectionContentWrapper = styled.div<{ isOpen: boolean }>`
  height: ${({ isOpen }) => (isOpen ? "auto" : "0")};
  overflow: hidden;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  transition: opacity 0.3s ease;
`;
