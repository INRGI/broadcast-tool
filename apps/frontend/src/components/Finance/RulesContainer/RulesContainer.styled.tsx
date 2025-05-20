import styled from "@emotion/styled";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: #282727;
  padding: 10px;
  border-radius: 12px;
`;

export const RuleRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const Input = styled.input`
  background-color: #2a2a2a;
  border: 1px solid #444;
  color: #fff;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  flex: 1;
  min-width: 80px;
`;

export const Select = styled.select`
  background-color: #2a2a2a;
  border: 1px solid #444;
  color: #fff;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
`;

export const Button = styled.button`
  background-color: #fca311;
  border: none;
  color: #fff;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  justify-content: center;

  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background-color: #e19110;
  }
`;

export const IconButton = styled.button`
  background: transparent;
  border: none;
  color: #aaa;
  cursor: pointer;
  font-size: 16px;
  padding: 6px;

  &:hover {
    color: #f55;
  }
`;