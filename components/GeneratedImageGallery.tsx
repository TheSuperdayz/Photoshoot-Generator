import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { DownloadIcon } from './icons/DownloadIcon';
import { QuillIcon } from './icons/QuillIcon';
import type { SessionImage } from '../types';

interface GeneratedImageGalleryProps {
  images: SessionImage[];
  isLoading: boolean;
  onGenerateCopy: (imageSrc: string) => void;
  onImageClick: (imageSrc: string) => void;
}

const GalleryItem: React.FC<{ src: string; onGenerateCopy: (src: string) => void; onImageClick: (src: string) => void; index: number; }> = ({ src, onGenerateCopy, onImageClick, index }) => {
  return (
    <div 
      className="relative group aspect-square bg-white/5 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 animate-item-enter cursor-zoom-in"
      style={{ animationDelay: `${Math.min(index * 50, 500)}ms`, animationFillMode: 'backwards' }}
      onClick={() => onImageClick(src)}
    >
      <img src={src} alt="Generated photoshoot" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 pointer-events-none">
        <a
          href={src}
          download={`superdayz-photo-${Date.now()}.png`}
          className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white font-semibold py-2 px-3 rounded-full hover:bg-white/30 transition-colors pointer-events-auto"
          title="Download Image"
          onClick={(e) => e.stopPropagation()}
        >
          <DownloadIcon className="w-5 h-5" />
        </a>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onGenerateCopy(src);
          }}
          className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white font-semibold py-2 px-3 rounded-full hover:bg-white/30 transition-colors pointer-events-auto"
          title="Write Copy for this Image"
        >
          <QuillIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export const GeneratedImageGallery: React.FC<GeneratedImageGalleryProps> = ({ images, isLoading, onGenerateCopy, onImageClick }) => {
  if (isLoading && images.length === 0) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center bg-white/5 backdrop-blur-lg rounded-2xl">
        <LoadingSpinner />
        <p className="text-lg text-gray-400 mt-4">Generating your creative photoshoot...</p>
        <p className="text-sm text-gray-500">This may take a moment.</p>
      </div>
    );
  }

  if (!isLoading && images.length === 0) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center bg-white/5 backdrop-blur-lg rounded-2xl border-2 border-dashed border-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 className="mt-4 text-xl font-semibold text-gray-300">Your generated photos will appear here</h3>
        <p className="mt-1 text-gray-500">Upload images and a prompt to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {isLoading && (
        <div className="relative aspect-square bg-white/10 rounded-lg flex items-center justify-center">
           <div className="absolute inset-0 bg-black/50 z-10"></div>
           <LoadingSpinner />
        </div>
      )}
      {images.map((image, index) => (
        <GalleryItem key={image.id} src={image.src} index={index} onGenerateCopy={() => onGenerateCopy(image.src)} onImageClick={onImageClick} />
      ))}
    </div>
  );
};