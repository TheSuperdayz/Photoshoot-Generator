import React, { useCallback, useRef } from 'react';
import type { ImageData } from '../types';
import { PhotoIcon } from './icons/PhotoIcon';
import { Tooltip } from './Tooltip';

interface MultiImageUploaderProps {
  label: string;
  images: (ImageData | null)[];
  onImagesChange: (images: (ImageData | null)[]) => void;
  maxImages: number;
}

const UploaderSlot: React.FC<{
  imageData: ImageData | null;
  onImageUpload: (imageData: ImageData) => void;
  onImageRemove: () => void;
  index: number;
}> = ({ imageData, onImageUpload, onImageRemove, index }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onImageUpload({ base64: base64String, mimeType: file.type });
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageRemove();
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
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
      {imageData ? (
        <>
          <img src={imageData.base64} alt={`Upload ${index+1}`} className="w-full h-full object-cover" />
          <button
            onClick={handleRemove}
            className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/80 transition-all"
            aria-label="Remove image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </>
      ) : (
        <div className="text-center p-1">
          <PhotoIcon className="w-8 h-8 mx-auto" />
          <p className="mt-1 text-xs">Person {index + 1}</p>
        </div>
      )}
    </div>
  );
};

export const MultiImageUploader: React.FC<MultiImageUploaderProps> = ({ label, images, onImagesChange, maxImages }) => {
  
  const handleUpload = (index: number, imageData: ImageData) => {
    const newImages = [...images];
    newImages[index] = imageData;
    onImagesChange(newImages);
  };

  const handleRemove = (index: number) => {
    const newImages = [...images];
    newImages[index] = null;
    onImagesChange(newImages);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <div className={`grid grid-cols-3 gap-2`}>
        {Array.from({ length: maxImages }).map((_, index) => (
          <UploaderSlot
            key={index}
            index={index}
            imageData={images[index]}
            onImageUpload={(data) => handleUpload(index, data)}
            onImageRemove={() => handleRemove(index)}
          />
        ))}
      </div>
    </div>
  );
};