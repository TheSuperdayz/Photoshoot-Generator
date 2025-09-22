import React, { useState, useCallback, useRef } from 'react';
import type { ImageData } from '../types';
import { PhotoIcon } from './icons/PhotoIcon';
import { Tooltip } from './Tooltip';

interface ImageUploaderProps {
  label: string;
  onImageUpload: (imageData: ImageData | null) => void;
  tooltip?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ label, onImageUpload, tooltip }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreview(base64String);
        onImageUpload({ base64: base64String, mimeType: file.type });
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const handleRemoveImage = useCallback(() => {
    setPreview(null);
    onImageUpload(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }, [onImageUpload]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center">
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <Tooltip content={tooltip || ''}>
        <div
          className="relative w-full aspect-square bg-black/20 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-300 transition-colors duration-300 cursor-pointer overflow-hidden"
          onClick={handleClick}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
          />
          {preview ? (
            <>
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage();
                }}
                className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/80 transition-all"
                aria-label="Remove image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </>
          ) : (
            <div className="text-center">
              <PhotoIcon className="w-10 h-10 mx-auto" />
              <p className="mt-2 text-xs">Click to upload</p>
            </div>
          )}
        </div>
      </Tooltip>
    </div>
  );
};
