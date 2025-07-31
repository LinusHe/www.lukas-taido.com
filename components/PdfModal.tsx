import React, { useState, useCallback, useRef, useEffect } from 'react';
import Modal from 'react-modal';
import { Document, Page, pdfjs } from 'react-pdf';
import styled from 'styled-components';
import { Press } from '../types';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
// pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

// Set the app element for the modal
if (typeof window !== 'undefined') {
  Modal.setAppElement('#__next');
}

interface PdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  pressItem: Press | null;
  cmsUrl: string;
}

// Augment the PDF document type to include alt text
interface PdfDocument {
  id: string;
  filename: string;
  url: string;
  alt?: string;
}

const PdfModal: React.FC<PdfModalProps> = ({ isOpen, onClose, pressItem, cmsUrl }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [scale, setScale] = useState(1);
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });
  const [contentWidth, setContentWidth] = useState(0);
  const [contentLoaded, setContentLoaded] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0, scrollX: 0, scrollY: 0 });

  // Detect if device is desktop
  useEffect(() => {
    const checkIfDesktop = () => {
      // Consider devices with width >= 768px as desktop
      // You can adjust this threshold as needed
      const isDesktopDevice = window.innerWidth >= 768 && !('ontouchstart' in window);
      setIsDesktop(isDesktopDevice);
    };

    checkIfDesktop();
    window.addEventListener('resize', checkIfDesktop);
    return () => window.removeEventListener('resize', checkIfDesktop);
  }, []);

  // Reset states when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      // Reset states when modal closes
      setContentLoaded(false);
      setScrollPosition({ x: 0, y: 0 });
      setScale(1); // Reset zoom level
      setIsDragging(false);
    } else {
      // Reset position when a new modal opens
      setScrollPosition({ x: 0, y: 0 });
      setScale(1); // Reset zoom level
      if (containerRef.current) {
        containerRef.current.scrollLeft = 0;
        containerRef.current.scrollTop = 0;
      }
    }
  }, [isOpen]);

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

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number; }) => {
    setNumPages(numPages);
    setContentLoaded(true);
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      const updateContentWidth = () => {
        const width = contentRef.current?.scrollWidth || 0;
        setContentWidth(width);
      };

      updateContentWidth();
      window.addEventListener('resize', updateContentWidth);
      return () => window.removeEventListener('resize', updateContentWidth);
    }
  }, [scale, numPages]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isDesktop) return;

    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      scrollX: scrollPosition.x,
      scrollY: scrollPosition.y
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDesktop || !isDragging || !containerRef.current) return;

    const deltaX = dragStartRef.current.x - e.clientX;
    const deltaY = dragStartRef.current.y - e.clientY;

    const newScrollX = dragStartRef.current.scrollX + deltaX;
    const newScrollY = dragStartRef.current.scrollY + deltaY;

    // Calculate max scroll positions
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    const maxScrollX = Math.max(0, contentWidth - containerWidth);
    const maxScrollY = containerRef.current.scrollHeight - containerHeight;

    const constrainedScrollX = Math.max(0, Math.min(maxScrollX, newScrollX));
    const constrainedScrollY = Math.max(0, Math.min(maxScrollY, newScrollY));

    setScrollPosition({ x: constrainedScrollX, y: constrainedScrollY });
    containerRef.current.scrollLeft = constrainedScrollX;
    containerRef.current.scrollTop = constrainedScrollY;
  };

  const handleMouseUp = () => {
    if (!isDesktop) return;
    setIsDragging(false);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollPosition({
      x: e.currentTarget.scrollLeft,
      y: e.currentTarget.scrollTop
    });
  };

  const zoomIn = () => setScale(prev => Math.min(prev + 0.1, 4));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.2));
  const resetZoom = () => setScale(1);

  if (!pressItem) return null;

  const documentTitle = pressItem.title || 'Press document';
  const pdfDoc = pressItem.pdfDocument as unknown as PdfDocument;
  const documentAlt = pdfDoc?.alt || `PDF document: ${documentTitle}`;

  return (
    <StyledModal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel={`PDF document: ${documentTitle}`}
      className="modal-content"
      overlayClassName="modal-overlay"
      shouldCloseOnOverlayClick={true}
      ariaHideApp={true}
      closeTimeoutMS={500}
      appElement={typeof window !== 'undefined' ? document.getElementById('__next') as HTMLElement : undefined}
    >
      <CloseButton
        onClick={onClose}
        aria-label="Close document viewer"
      >
        ×
      </CloseButton>

      <PDFContainer onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-label={documentTitle}>
        {pdfDoc && (
          <>
            {!contentLoaded && <Loader>Loading PDF...</Loader>}
            <AnimatedContent className={contentLoaded ? 'loaded' : ''}>
              <Document
                file={`${cmsUrl}${pdfDoc.url}`}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={null}
                error={<div role="alert">Failed to load PDF. Please try again later.</div>}
                inputRef={(ref) => {
                  if (ref) {
                    ref.setAttribute('aria-label', documentAlt);
                  }
                }}
              >
                <ScrollContainer
                  ref={containerRef}
                  onScroll={handleScroll}
                  onMouseDown={isDesktop ? handleMouseDown : undefined}
                  onMouseMove={isDesktop ? handleMouseMove : undefined}
                  onMouseUp={isDesktop ? handleMouseUp : undefined}
                  onMouseLeave={isDesktop ? handleMouseUp : undefined}
                  style={{ cursor: isDesktop ? (isDragging ? 'grabbing' : 'grab') : 'auto' }}
                  role="region"
                  aria-label="PDF document content"
                >
                  <PageContainer ref={contentRef}>
                    {Array.from(new Array(numPages), (_, index) => (
                      <Page
                        key={`page_${index + 1}`}
                        pageNumber={index + 1}
                        scale={scale}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        width={typeof window !== 'undefined' ? Math.min(window.innerWidth * 0.9, 1000) : 800}
                        inputRef={(ref) => {
                          if (ref) {
                            ref.setAttribute('aria-label', `Page ${index + 1} of ${numPages}`);
                          }
                        }}
                      />
                    ))}
                  </PageContainer>
                </ScrollContainer>
              </Document>
            </AnimatedContent>

            <ZoomControls aria-label="Zoom controls">
              <ZoomButton
                onClick={zoomOut}
                aria-label="Zoom out"
              >
                -
              </ZoomButton>
              <ZoomButton
                onClick={resetZoom}
                aria-label="Reset zoom"
              >
                {Math.round(scale * 100)}%
              </ZoomButton>
              <ZoomButton
                onClick={zoomIn}
                aria-label="Zoom in"
              >
                +
              </ZoomButton>
            </ZoomControls>
          </>
        )}
      </PDFContainer>
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

const AnimatedContent = styled.div`
  opacity: 0;
  transform: translateY(100px);
  transition: opacity 300ms cubic-bezier(0.4, 0, 0.2, 1), transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: 100ms;
  will-change: opacity, transform;
  position: relative;

  &.loaded {
    opacity: 1;
    transform: translateY(0);
  }

  .ReactModal__Content--before-close & {
    opacity: 0;
    transform: translateY(30px);
    transition-delay: 0ms;
  }
`;

const PDFContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  gap: 60px;
  justify-content: center;
`;

const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  font-size: 1.2rem;
  color: #fff;
`;

const ZoomControls = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
  background: rgba(255, 255, 255, 0.95);
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 10001;
  opacity: 0;
  transition: opacity 300ms cubic-bezier(0.4, 0, 0.2, 1);

  .ReactModal__Content--after-open & {
    opacity: 1;
  }

  .ReactModal__Content--before-close & {
    opacity: 0;
  }
`;

const ZoomButton = styled.button`
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px 15px;
  cursor: pointer;
  transition: background-color 0.2s;
  min-width: 40px;

  &:hover {
    background: #e0e0e0;
  }
`;

const ScrollContainer = styled.div`
  max-height: 90svh;
  max-width: 100vw;
  overflow: auto;
  user-select: none;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-corner {
    background: transparent;
  }
`;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 0 20px;
  min-width: fit-content;
`;

export default PdfModal;