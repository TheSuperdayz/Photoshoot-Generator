import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DownloadIcon } from './icons/DownloadIcon';

interface ImageZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string | null;
}

export const ImageZoomModal: React.FC<ImageZoomModalProps> = ({ isOpen, onClose, imageSrc }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const lastMousePosition = useRef({ x: 0, y: 0 });

  // Reset state when modal opens with a new image
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen, imageSrc]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  }, [onClose]);

  // Handle Escape key and background scrolling
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleClose]);

  // Zoom handler
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (isDragging) return;

    // The deltaY is multiplied by a small number to control zoom speed
    const delta = e.deltaY * -0.005;
    const newScale = Math.min(Math.max(1, scale + delta), 5); // Clamp scale between 1x and 5x
    
    setScale(newScale);

    // If zoomed all the way out, reset position to center
    if (newScale === 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      e.preventDefault(); // Prevent default image drag behavior
      setIsDragging(true);
      lastMousePosition.current = { x: e.clientX, y: e.clientY };
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || scale <= 1) return;
    
    const dx = e.clientX - lastMousePosition.current.x;
    const dy = e.clientY - lastMousePosition.current.y;
    
    setPosition(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    
    lastMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };
  
  if (!isOpen && !isClosing) return null;
  if (!imageSrc) return null;
  
  const imageCursor = isDragging ? 'grabbing' : (scale > 1 ? 'grab' : 'zoom-in');
  
  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-8 ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
      onClick={handleClose}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // Stop dragging if mouse leaves the window
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative w-full h-full flex items-center justify-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onWheel={handleWheel}
      >
        <button
          onClick={handleClose}
          className="absolute top-0 right-0 m-4 text-white bg-black/40 rounded-full p-2 hover:bg-black/60 transition-colors z-20"
          aria-label="Close image preview"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div 
          className="w-full h-full"
          onMouseDown={handleMouseDown}
        >
            <img
              src={imageSrc}
              alt="Zoomed-in generated content"
              className={`absolute top-0 left-0 w-full h-full rounded-lg shadow-2xl transition-transform duration-100 ease-out ${scale === 1 ? 'object-contain' : 'object-none'}`}
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                cursor: imageCursor,
                transformOrigin: 'center center',
                willChange: 'transform',
              }}
              draggable="false"
            />
        </div>
        
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900/60 backdrop-blur-sm text-white text-xs py-1 px-3 rounded-full opacity-70 pointer-events-none">
            Scroll to zoom, drag to pan when zoomed
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
            <a
              href={imageSrc}
              download={`superdayz-image-${Date.now()}.png`}
              className="flex items-center gap-2 bg-slate-900/60 backdrop-blur-sm text-white font-semibold py-2 px-4 rounded-full hover:bg-black/60 transition-colors"
              title="Download Image"
            >
              <DownloadIcon className="w-5 h-5" />
              <span>Download</span>
            </a>
            {scale > 1 && (
                 <button
                    onClick={resetZoom}
                    className="flex items-center gap-2 bg-slate-900/60 backdrop-blur-sm text-white font-semibold py-2 px-4 rounded-full hover:bg-black/60 transition-colors"
                    title="Reset Zoom"
                 >
                    <span>Reset Zoom</span>
                </button>
            )}
        </div>
      </div>
    </div>
  );
};