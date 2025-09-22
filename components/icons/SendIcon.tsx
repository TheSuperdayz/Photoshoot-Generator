import React from 'react';

export const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    className={className}
    fill="none"
  >
    <defs>
        <linearGradient id="sendGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#67E8F9" />
            <stop offset="100%" stopColor="#0EA5E9" />
        </linearGradient>
         <filter id="sendShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0.5" dy="1" stdDeviation="0.5" floodColor="#000000" floodOpacity="0.2"/>
        </filter>
    </defs>
    <g filter="url(#sendShadow)">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" transform="scale(0.8) translate(-1, -2)" fill="url(#sendGrad)" />
    </g>
  </svg>
);
