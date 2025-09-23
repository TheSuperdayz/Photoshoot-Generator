import React from 'react';
import { Tooltip } from './Tooltip';

interface WatermarkToggleProps {
  isEnabled: boolean;
  setIsEnabled: (enabled: boolean) => void;
  isDisabled: boolean;
  tooltipContent: string;
}

export const WatermarkToggle: React.FC<WatermarkToggleProps> = ({ isEnabled, setIsEnabled, isDisabled, tooltipContent }) => {
  const toggleClasses = isEnabled ? 'bg-sky-500' : 'bg-slate-600';
  const disabledClasses = isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  return (
    <Tooltip content={tooltipContent}>
      <div className={`flex items-center justify-between bg-black/20 p-3 rounded-lg border border-white/5 ${isDisabled ? 'opacity-60' : ''}`}>
        <label htmlFor="watermark-toggle" className={`text-sm font-medium text-slate-200 ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
          Add Watermark
        </label>
        <button
          id="watermark-toggle"
          role="switch"
          aria-checked={isEnabled}
          onClick={() => !isDisabled && setIsEnabled(!isEnabled)}
          disabled={isDisabled}
          className={`${toggleClasses} ${disabledClasses} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800`}
        >
          <span
            className={`${isEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />
        </button>
      </div>
    </Tooltip>
  );
};
