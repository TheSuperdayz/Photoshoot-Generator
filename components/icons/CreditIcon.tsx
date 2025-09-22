import React from 'react';

export const CreditIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    className={className} 
    fill="none"
  >
    <defs>
      <linearGradient id="creditGold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FBBF24"/>
        <stop offset="100%" stopColor="#F59E0B"/>
      </linearGradient>
      <linearGradient id="creditShine" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="white" stopOpacity="0.7"/>
        <stop offset="100%" stopColor="white" stopOpacity="0"/>
      </linearGradient>
      <filter id="creditShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="1" dy="1" stdDeviation="1" floodColor="#F59E0B" floodOpacity="0.4"/>
      </filter>
    </defs>
    <g filter="url(#creditShadow)">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" fill="url(#creditGold)" />
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" fill="url(#creditShine)" />
    </g>
  </svg>
);
