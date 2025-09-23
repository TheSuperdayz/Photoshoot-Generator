import React from 'react';
import { Tooltip } from './Tooltip';

interface PersonalitySelectorProps {
  selectedPersonality: string;
  onSelect: (personality: string) => void;
  tooltips?: Record<string, string>;
}

const personalities = ['Chill Buddy', 'Wise Mentor', 'Sassy Bestie', 'Professional Coach'];

export const PersonalitySelector: React.FC<PersonalitySelectorProps> = ({ selectedPersonality, onSelect, tooltips }) => {
  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2">
        {personalities.map((personality) => (
          <Tooltip key={personality} content={tooltips?.[personality] || ''}>
            <button
              onClick={() => onSelect(personality)}
              type="button"
              className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-400 ${
                selectedPersonality === personality
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'bg-white/10 text-gray-200 hover:bg-white/20'
              }`}
            >
              {personality}
            </button>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};