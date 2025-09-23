import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { DownloadIcon } from './icons/DownloadIcon';
import type { SessionVideo } from '../types';

interface GeneratedVideoGalleryProps {
  videos: SessionVideo[];
  isLoading: boolean;
  loadingMessage: string;
}

export const GeneratedVideoGallery: React.FC<GeneratedVideoGalleryProps> = ({ videos, isLoading, loadingMessage }) => {

  if (isLoading && videos.length === 0) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center bg-white/5 backdrop-blur-lg rounded-2xl">
        <LoadingSpinner />
        <p className="text-lg text-gray-400 mt-6">{loadingMessage}</p>
        <p className="text-sm text-gray-500 mt-2">Video generation can take a few minutes. Please be patient.</p>
      </div>
    );
  }

  if (!isLoading && videos.length === 0) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center bg-white/5 backdrop-blur-lg rounded-2xl border-2 border-dashed border-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <h3 className="mt-4 text-xl font-semibold text-gray-300">Your generated videos will appear here</h3>
        <p className="mt-1 text-gray-500">Describe a scene to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {isLoading && (
        <div className="relative aspect-video bg-white/10 rounded-lg flex items-center justify-center">
           <div className="absolute inset-0 bg-black/50 z-10"></div>
           <LoadingSpinner />
        </div>
      )}
      {videos.map((video, index) => (
         <div 
            key={video.id} 
            className="relative group aspect-video bg-white/5 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 animate-item-enter"
            style={{ animationDelay: `${Math.min(index * 50, 500)}ms`, animationFillMode: 'backwards' }}
          >
           <video 
              src={video.src}
              controls 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                <a
                  href={video.src}
                  download={`superdayz-video-${video.id}.mp4`}
                  className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white font-semibold py-2 px-3 rounded-full hover:bg-white/30"
                  title="Download Video"
                >
                  <DownloadIcon className="w-5 h-5" />
                </a>
            </div>
        </div>
      ))}
    </div>
  );
};