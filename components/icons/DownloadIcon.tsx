import React from 'react';

export const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={className}
    fill="none"
  >
    <defs>
        <linearGradient id="downloadGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
         <filter id="downloadShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0.5" dy="1" stdDeviation="1" floodColor="#000000" floodOpacity="0.2"/>
        </filter>
    </defs>
    <g filter="url(#downloadShadow)">
        <path d="M12 15L12 3" stroke="url(#downloadGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 11L12 15L8 11" stroke="url(#downloadGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 17L4 19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V17" stroke="url(#downloadGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
  </svg>
);
