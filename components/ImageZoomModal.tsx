import React, { useState, useEffect } from 'react';
import { DownloadIcon } from './icons/DownloadIcon';

interface ImageZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string | null;
}

export const ImageZoomModal: React.FC<ImageZoomModalProps> = ({ isOpen, onClose, imageSrc }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);


  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300); // Match animation duration
  };

  if (!isOpen && !isClosing) return null;
  if (!imageSrc) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-8 ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
      onClick={handleClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className={`relative w-full h-full flex flex-col items-center justify-center ${isClosing ? 'animate-scale-out' : 'animate-scale-in'}`}
        onClick={(e) => e.stopPropagation()}
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

        <img
          src={imageSrc}
          alt="Zoomed-in generated content"
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
        />

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 mb-4">
            <a
              href={imageSrc}
              download={`superdayz-image-${Date.now()}.png`}
              className="flex items-center gap-2 bg-slate-900/60 backdrop-blur-sm text-white font-semibold py-2 px-4 rounded-full hover:bg-black/60 transition-colors"
              title="Download Image"
            >
              <DownloadIcon className="w-5 h-5" />
              <span>Download</span>
            </a>
        </div>
      </div>
    </div>
  );
};
