import React from 'react';
import { Tooltip } from './Tooltip';

interface PresetSelectorProps {
  label: string;
  options: string[];
  selectedOption: string;
  onSelect: (option: string) => void;
  tooltips?: Record<string, string>;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({ label, options, selectedOption, onSelect, tooltips }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Tooltip key={option} content={tooltips?.[option] || ''}>
            <button
              key={option}
              onClick={() => onSelect(option)}
              type="button"
              className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-400 ${
                selectedOption === option
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'bg-white/10 text-gray-200 hover:bg-white/20'
              }`}
            >
              {option}
            </button>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};
