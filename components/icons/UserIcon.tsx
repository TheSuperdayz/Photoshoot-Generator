import React from 'react';

export const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    className={className} 
    fill="none"
  >
    <defs>
        <linearGradient id="userGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#9CA3AF" />
            <stop offset="100%" stopColor="#6B7280" />
        </linearGradient>
        <filter id="userShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000000" floodOpacity="0.2"/>
        </filter>
    </defs>
    <g filter="url(#userShadow)">
      <circle cx="12" cy="8" r="4" fill="url(#userGrad)" />
      <path d="M12 14c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z" fill="url(#userGrad)" />
    </g>
  </svg>
);
