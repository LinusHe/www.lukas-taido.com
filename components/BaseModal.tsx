import React, { useEffect } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';

// Set the app element for the modal
if (typeof window !== 'undefined') {
  Modal.setAppElement('#__next');
}

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const BaseModal: React.FC<BaseModalProps> = ({ isOpen, onClose, title, children }) => {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      // Delay restoring overflow to avoid flickering during exit animation
      setTimeout(() => {
        document.body.style.overflow = originalStyle;
      }, 300);
    };
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <StyledModal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel={title}
      className="modal-content"
      overlayClassName="modal-overlay"
      shouldCloseOnOverlayClick={true}
      ariaHideApp={true}
      closeTimeoutMS={500}
      appElement={typeof window !== 'undefined' ? document.getElementById('__next') as HTMLElement : undefined}
    >
      <CloseButton
        onClick={onClose}
        aria-label="Close modal"
      >
        ×
      </CloseButton>

      <ModalContainer onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-label={title}>
        {children}
      </ModalContainer>
    </StyledModal>
  );
};

const StyledModal = styled(Modal)`
  &.modal-content {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    overflow: hidden;
    outline: none;
    padding: 0;
    z-index: 10000;
    opacity: 0;
    transition: opacity 400ms cubic-bezier(0.4, 0, 0.2, 1);
    will-change: opacity;
  }
  
  &.ReactModal__Content--after-open {
    opacity: 1;
  }
  
  &.ReactModal__Content--before-close {
    opacity: 0;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: transparent;
    z-index: 9999;
    opacity: 0;
    transition: opacity 400ms cubic-bezier(0.4, 0, 0.2, 1);
    will-change: opacity;
  }
  
  .ReactModal__Overlay--after-open {
    opacity: 1;
  }
  
  .ReactModal__Overlay--before-close {
    opacity: 0;
  }
`;

const CloseButton = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  border: none;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: opacity 300ms cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;

  &:hover {
    transform: scale(1.1);
  }

  .ReactModal__Content--after-open & {
    opacity: 1;
  }

  .ReactModal__Content--before-close & {
    opacity: 0;
  }
`;

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
`;

export default BaseModal; 