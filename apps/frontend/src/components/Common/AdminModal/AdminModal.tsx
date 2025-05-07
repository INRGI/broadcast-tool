import React, { useEffect } from 'react';
import ReactModal from 'react-modal';

import { keyframes } from '@emotion/react';
import { CloseButton } from './AdminModal.styled';

ReactModal.setAppElement('#root');

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
`;


const AdminModal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick={true}
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 990,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
        content: {
          position: 'relative',
          padding: 0,
          border: 'none',
          background: 'none',
          inset: 'unset',
          overflow: 'visible',
          animation: `${isOpen ? fadeIn : fadeOut} 0.3s ease-in-out`,
        },
      }}
    >
      <CloseButton onClick={onClose}>&times;</CloseButton>
      {children}
    </ReactModal>
  );
};

export default AdminModal;
