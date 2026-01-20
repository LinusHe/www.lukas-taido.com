import React, { useEffect, useCallback, useState } from 'react';
import Modal from 'react-modal';
import styled, { keyframes } from 'styled-components';
import Image from 'next/image';

if (typeof window !== 'undefined') {
  Modal.setAppElement('#__next');
}

interface LightboxImage {
  src: string;
  alt: string;
  caption?: string;
}

interface ImageLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: LightboxImage[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({
  isOpen,
  onClose,
  images,
  currentIndex,
  onNavigate,
}) => {
  const hasMultipleImages = images.length > 1;
  const [isLoading, setIsLoading] = useState(true);

  // Reset loading state when image changes
  useEffect(() => {
    setIsLoading(true);
  }, [currentIndex]);

  const goToPrevious = useCallback(() => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    onNavigate(newIndex);
  }, [currentIndex, images.length, onNavigate]);

  const goToNext = useCallback(() => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    onNavigate(newIndex);
  }, [currentIndex, images.length, onNavigate]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, goToPrevious, goToNext, onClose]);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (images.length === 0) return null;

  const currentImage = images[currentIndex];

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <StyledModal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Image lightbox"
      className="lightbox-content"
      overlayClassName="lightbox-overlay"
      shouldCloseOnOverlayClick={true}
      closeTimeoutMS={300}
    >
      <CloseButton onClick={onClose} aria-label="Close lightbox">
        ×
      </CloseButton>

      <LightboxContainer onClick={handleOverlayClick}>
        {hasMultipleImages && (
          <NavButton
            $position="left"
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            aria-label="Previous image"
          >
            ‹
          </NavButton>
        )}

        <ImageWrapper onClick={(e) => e.stopPropagation()}>
          {isLoading && (
            <LoadingSpinner>
              <Spinner />
            </LoadingSpinner>
          )}
          <Image
            src={currentImage.src}
            alt={currentImage.alt}
            fill
            style={{ objectFit: 'contain', opacity: isLoading ? 0 : 1, transition: 'opacity 0.2s ease' }}
            sizes="100vw"
            priority
            onLoad={() => setIsLoading(false)}
          />
        </ImageWrapper>

        {hasMultipleImages && (
          <NavButton
            $position="right"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            aria-label="Next image"
          >
            ›
          </NavButton>
        )}

        <BottomBar>
          {currentImage.caption && <Caption>{currentImage.caption}</Caption>}
          {hasMultipleImages && (
            <Counter>
              {currentIndex + 1} / {images.length}
            </Counter>
          )}
        </BottomBar>
      </LightboxContainer>
    </StyledModal>
  );
};

const StyledModal = styled(Modal)`
  &.lightbox-content {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.95);
    overflow: hidden;
    outline: none;
    z-index: 10000;
    opacity: 0;
    transition: opacity 300ms ease;
  }

  &.ReactModal__Content--after-open {
    opacity: 1;
  }

  &.ReactModal__Content--before-close {
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
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const LightboxContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 60px 20px 80px;
  box-sizing: border-box;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  max-width: calc(100% - 120px);

  @media only screen and (max-width: 550px) {
    max-width: 100%;
  }
`;

const NavButton = styled.button<{ $position: 'left' | 'right' }>`
  position: absolute;
  ${({ $position }) => $position}: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001;
  transition: transform 0.2s ease, background 0.2s ease;
  padding: 0;
  padding-bottom: 3px;
  ${({ $position }) => $position === 'left' ? 'padding-right: 2px;' : 'padding-left: 2px;'}

  &:hover {
    transform: translateY(-50%) scale(1.1);
    background: white;
  }

  @media only screen and (max-width: 550px) {
    width: 40px;
    height: 40px;
    font-size: 22px;
    ${({ $position }) => $position}: 10px;
  }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingSpinner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-top-color: white;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const BottomBar = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  z-index: 10001;
`;

const Caption = styled.p`
  color: white;
  font-size: 14px;
  text-align: center;
  max-width: 80vw;
  margin: 0;
`;

const Counter = styled.span`
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
`;

export default ImageLightbox;
