import React from 'react';

export const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={className}
        fill="none"
    >
        <defs>
            <linearGradient id="searchGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#E5E7EB" />
                <stop offset="100%" stopColor="#BCC1C9" />
            </linearGradient>
            <radialGradient id="searchLens" cx="0.3" cy="0.3" r="0.8">
                <stop offset="0%" stopColor="white" stopOpacity="0.5" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
             <filter id="searchShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0.5" dy="1" stdDeviation="1" floodColor="#000000" floodOpacity="0.15"/>
            </filter>
        </defs>
        <g filter="url(#searchShadow)">
            <circle cx="10.5" cy="10.5" r="7" stroke="url(#searchGrad)" strokeWidth="3" />
            <line x1="16" y1="16" x2="21" y2="21" stroke="url(#searchGrad)" strokeWidth="3" strokeLinecap="round" />
            <circle cx="10.5" cy="10.5" r="5" fill="url(#searchLens)" />
        </g>
    </svg>
);
