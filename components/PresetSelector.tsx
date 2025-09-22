import React from 'react';

interface PresetSelectorProps {
  label: string;
  options: string[];
  selectedOption: string;
  onSelect: (option: string) => void;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({ label, options, selectedOption, onSelect }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
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
        ))}
      </div>
    </div>
  );
};