import React from 'react';

export const PhotoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={className}
    fill="none"
  >
    <defs>
        <linearGradient id="photoSky" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7DD3FC"/>
            <stop offset="100%" stopColor="#38BDF8"/>
        </linearGradient>
        <linearGradient id="photoSun" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FDE047"/>
            <stop offset="100%" stopColor="#FBBF24"/>
        </linearGradient>
         <filter id="photoShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#000" floodOpacity="0.15"/>
        </filter>
    </defs>
    <g transform="rotate(-5 12 12)" filter="url(#photoShadow)">
        <rect x="3" y="3" width="18" height="18" rx="2" fill="#E5E7EB"/>
        <rect x="5" y="5" width="14" height="10" fill="url(#photoSky)"/>
        <path d="M5 15L9 11L11.5 13.5L14 11L19 15H5Z" fill="#10B981" fillOpacity="0.8"/>
        <circle cx="8" cy="8" r="1.5" fill="url(#photoSun)"/>
    </g>
  </svg>
);
