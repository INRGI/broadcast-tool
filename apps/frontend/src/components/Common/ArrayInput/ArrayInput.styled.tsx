import styled from "@emotion/styled";

export const SectionWrapper = styled.div`
  width: calc(100%);
  padding: 10px;
  background-color: #2b2b2b;
  border: 1px solid #4f4f4f;
  border-radius: 8px;
`;

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-bottom: 10px;
`;

export const FieldRow = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  align-items: center;
`;

export const StyledInput = styled.input`
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #4f4f4f;
  background-color: #3a3a3a;
  color: white;
  flex: 1;
  font-size: 14px;
`;

export const AddButton = styled.button`
  background-color: #6a5acd;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #5941a9;
  }
`;

export const RemoveButton = styled.button`
  background-color: #d9534f;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 14px;
  margin: 0;

  &:hover {
    background-color: #c9302c;
  }
`;

export const Label = styled.label`
  color: white;
  font-size: 14px;
  margin-bottom: 4px;
  display: block;
`;

export const Title = styled.p`
  color: white;
  font-size: 16px;
  margin: 0;
  padding: 0;
  text-align: center;
`;

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
`;

export const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
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

export const ModalBody = styled.div`
  background-color: #181818;
  padding: 25px;
  border-radius: 10px;
  width: calc(50vw);
  height: calc(50vh);
  max-width: 100%;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const ModalContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 40px;
  height: 100%;
`;

export const ModalLeft = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ModalRight = styled.div`
  flex: 1;
  background-color: #252525;
  padding: 15px;
  border-radius: 8px;
  overflow-y: auto;
`;

export const Textarea = styled.textarea`
  padding: 10px;
  background-color: #3a3a3a;
  border: 1px solid #4f4f4f;
  border-radius: 6px;
  color: white;
  font-size: 14px;
  resize: vertical;
`;

export const PreviewItem = styled.div`
  font-size: 14px;
  padding: 6px 0;
  border-bottom: 1px solid #444;

  strong {
    color: #6a5acd;
  }
`;

export const SubmitButton = styled.button<{ disabled?: boolean }>`
  background-color: ${({ disabled }) => (disabled ? "#444" : "#6a5acd")};
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px;
  margin-top: 10px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: background-color 0.3s;

  &:hover {
    background-color: ${({ disabled }) => (disabled ? "#444" : "#5941a9")};
  }
`;