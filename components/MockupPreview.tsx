import React from 'react';
import type { ImageData, Template } from '../types';

interface MockupPreviewProps {
  designImage: ImageData;
  template: Template;
}

export const MockupPreview: React.FC<MockupPreviewProps> = ({ designImage, template }) => {
  return (
    <div className="w-full h-auto flex flex-col items-center justify-center bg-white/5 backdrop-blur-lg rounded-2xl border-2 border-dashed border-gray-700 relative overflow-hidden p-4 animate-fade-in">
      <div className="absolute top-4 left-4 text-sm font-bold bg-black/50 text-white px-3 py-1 rounded-full z-20 shadow-lg">
        Quick Preview
      </div>
      <div className="relative flex items-center justify-center w-full aspect-square">
        <img src={template.src} alt={template.name} className="absolute inset-0 w-full h-full object-contain" />
        <img
          src={designImage.base64}
          alt="Design preview"
          className="absolute w-1/3 h-1/3 object-contain pointer-events-none opacity-80"
          style={{ 
            // A slight vertical offset to better center on common templates like T-shirts
            transform: 'translate(0, -10%)' 
          }}
        />
      </div>
       <p className="mt-4 text-xs text-gray-400 text-center max-w-sm">
        This is a static preview. The final AI-generated mockup will have realistic lighting, shadows, and perspective.
      </p>
    </div>
  );
};
