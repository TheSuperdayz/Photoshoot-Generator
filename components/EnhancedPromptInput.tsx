import React, { useState } from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface EnhancedPromptInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  rows?: number;
  maxLength?: number;
  examplePrompts: string[];
}

export const EnhancedPromptInput: React.FC<EnhancedPromptInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  maxLength = 500,
  examplePrompts,
}) => {
  const [showExamples, setShowExamples] = useState(false);

  const handleExampleClick = (prompt: string) => {
    onChange(prompt);
    setShowExamples(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label htmlFor={`enhanced-prompt-${label}`} className="block text-sm font-medium text-gray-300">
          {label}
        </label>
        {examplePrompts.length > 0 && (
          <button
            type="button"
            onClick={() => setShowExamples(!showExamples)}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-gray-300 px-2 py-1 rounded-full text-xs font-semibold transition-colors"
          >
            <SparklesIcon className="w-3 h-3" />
            Ideas
          </button>
        )}
      </div>
      <div className="relative">
        <textarea
          id={`enhanced-prompt-${label}`}
          rows={rows}
          className="w-full bg-black/20 border border-gray-600 rounded-lg p-3 pr-16 text-white focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition duration-200 placeholder-gray-400 resize-none"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
        />
        <div className="absolute bottom-2 right-3 text-xs text-gray-500 pointer-events-none">
          {value.length} / {maxLength}
        </div>
      </div>
      {showExamples && (
        <div className="mt-2 bg-black/20 p-2 rounded-lg animate-fade-in">
            <p className="text-xs text-gray-400 mb-2 px-1">Or try one of these:</p>
            <div className="flex flex-wrap gap-2">
                {examplePrompts.map((prompt, index) => (
                    <button
                        key={index}
                        type="button"
                        onClick={() => handleExampleClick(prompt)}
                        className="bg-white/5 hover:bg-white/15 text-gray-300 text-xs px-2 py-1 rounded-md transition-colors text-left"
                    >
                        {prompt}
                    </button>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};
