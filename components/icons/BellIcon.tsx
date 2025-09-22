import React from 'react';

export const BellIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={className}
        fill="none"
        stroke="currentColor"
    >
        <defs>
            <linearGradient id="bellGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
            <filter id="bellShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0.5" dy="1" stdDeviation="1" floodColor="#000000" floodOpacity="0.2"/>
            </filter>
        </defs>
        <g filter="url(#bellShadow)">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="url(#bellGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="url(#bellGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
    </svg>
);
