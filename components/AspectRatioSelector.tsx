import React from 'react';
import { SquareIcon } from './icons/SquareIcon';
import { LandscapeIcon } from './icons/LandscapeIcon';
import { PortraitIcon } from './icons/PortraitIcon';
import { Tooltip } from './Tooltip';

type AspectRatio = '1:1' | '16:9' | '9:16';

interface AspectRatioSelectorProps {
  selectedRatio: AspectRatio;
  onSelectRatio: (ratio: AspectRatio) => void;
  tooltips?: Record<string, string>;
}

const ratioOptions: { id: AspectRatio; label: string; icon: React.ReactNode }[] = [
  { id: '1:1', label: 'Square', icon: <SquareIcon className="w-5 h-5" /> },
  { id: '16:9', label: 'Landscape', icon: <LandscapeIcon className="w-5 h-5" /> },
  { id: '9:16', label: 'Portrait', icon: <PortraitIcon className="w-5 h-5" /> },
];

export const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ selectedRatio, onSelectRatio, tooltips }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">Aspect Ratio</label>
      <div className="grid grid-cols-3 gap-2">
        {ratioOptions.map((option) => (
          <Tooltip key={option.id} content={tooltips?.[option.id] || ''}>
            <button
              onClick={() => onSelectRatio(option.id)}
              type="button"
              className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-400 ${
                selectedRatio === option.id
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'bg-white/10 text-gray-200 hover:bg-white/20'
              }`}
            >
              {option.icon}
              <span className="text-xs font-semibold">{option.label}</span>
            </button>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};
