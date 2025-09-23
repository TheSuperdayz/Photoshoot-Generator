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
      <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Tooltip key={option} content={tooltips?.[option] || ''}>
            <button
              key={option}
              onClick={() => onSelect(option)}
              type="button"
              className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 ${
                selectedOption === option
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
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