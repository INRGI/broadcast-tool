import AdminModal from "../AdminModal";
import {
  ButtonContainer,
  CancelButton,
  ConfirmationText,
  Container,
  SubmitButton,
} from "./ConfirmationModal.styled";

interface Props {
  onClose: () => void;
  isOpen: boolean;
  confirmationText: string;
  onSubmit: () => void;
}

const ConfirmationModal: React.FC<Props> = ({
  onClose,
  isOpen,
  confirmationText,
  onSubmit,
}) => {
  return (
    <AdminModal isOpen={isOpen} onClose={onClose}>
      <Container>
        <ConfirmationText>{confirmationText}</ConfirmationText>
        <ButtonContainer>
          <CancelButton onClick={onClose}>Cancel</CancelButton>
          <SubmitButton onClick={onSubmit}>Submit</SubmitButton>
        </ButtonContainer>
      </Container>
    </AdminModal>
  );
};

export default ConfirmationModal;
