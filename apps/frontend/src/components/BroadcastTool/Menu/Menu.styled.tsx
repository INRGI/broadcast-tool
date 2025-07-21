import styled from "@emotion/styled";

export const RootContainer = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
  height: calc(100vh);
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: #3a3a3a;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.4);
  max-width: 470px;
  width: 100%;

  @media (max-width: 768px) {
    max-width: 100%;
  }
  min-width: 0;
  transition: all 0.3s ease;

  &.collapsed {
    h2 {
      transition: all 0.3s ease;
      font-size: 20px;
    }
    max-width: 270px;
    padding: 15px;
  }
`;

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  margin: 0;
  gap: 10px;
`;

export const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 20px;
  transition: all 0.3s ease;
  border: none;

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const ServicesBlockHeader = styled.div`
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-content: center;

  h2 {
    font-size: 30px;
    line-height: 1.2;
    color: #fff;
    margin: 0;
    font-weight: 500;
    font-family: "Arial Black", sans-serif;
    text-transform: uppercase;
    border-bottom: 2px solid #fff;
  }

  p {
    text-transform: uppercase;
    font-size: 20px;
    color: #fff;
    margin: 0;
    padding: 0;
    padding-left: 2px;
  }

  @media (max-width: 1023px) {
    h2 {
      font-size: 22px;
    }
    p {
      font-size: 15px;
    }
  }

  @media (max-width: 430px) {
    h2 {
      font-size: 16px;
    }
    p {
      font-size: 14px;
    }
  }
`;

export const DeleteButton = styled.button`
  align-items: center;
  appearance: none;
  background-color: #e63946;
  border-radius: 4px;
  border-width: 0;
  box-shadow: rgba(45, 35, 66, 0.4) 0 2px 4px,
    rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #b22b36 0 -3px 0 inset;
  box-sizing: border-box;
  color: white;
  cursor: pointer;
  display: inline-flex;
  font-family: "JetBrains Mono", monospace;
  height: 48px;
  justify-content: center;
  line-height: 1;
  list-style: none;
  overflow: hidden;
  padding-left: 5px;
  padding-right: 5px;
  position: relative;
  text-align: left;
  text-decoration: none;
  transition: box-shadow 0.15s, transform 0.15s;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  white-space: nowrap;
  will-change: box-shadow, transform;
  font-size: 18px;
  width: 50px;
  &:focus {
    box-shadow: #b22b36 0 0 0 1.5px inset, rgba(45, 35, 66, 0.4) 0 2px 4px,
      rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #b22b36 0 -3px 0 inset;
  }

  &:hover {
    box-shadow: rgba(45, 35, 66, 0.4) 0 4px 8px,
      rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #b22b36 0 -3px 0 inset;
    transform: translateY(-2px);
  }

  &:active {
    box-shadow: #b22b36 0 3px 7px inset;
    transform: translateY(2px);
  }
`;

export const BroadcastRulesContainer = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  padding: 0;
  height: auto;
  max-height: calc(100vh - 270px);
  min-height: calc(100vh - 270px);
  overflow-y: auto;

  @media (max-width: 768px) {
    max-height: none;
  }
`;

export const BroadcastRuleCard = styled.li<{ isActive: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #5c5c5c;
  padding: 10px 15px;
  border-radius: 8px;
  border: ${(props) =>
    props.isActive ? "2px solid #5acd60" : "2px solid transparent"};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  height: auto;
  min-height: 50px;
  max-width: 440px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;

  h2 {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
    padding-right: 15px;
    max-width: 90%;
  }

  div {
    display: flex;
    gap: 10px;
  }

  button {
    min-width: 50px;
  }
`;
