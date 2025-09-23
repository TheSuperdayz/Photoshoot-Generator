import React from 'react';

export const CrownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={className}
        fill="none"
    >
        <defs>
            <linearGradient id="crownGold" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FDE047"/>
                <stop offset="100%" stopColor="#FBBF24"/>
            </linearGradient>
            <filter id="crownShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="1" dy="1" stdDeviation="1" floodColor="#000" floodOpacity="0.3"/>
            </filter>
        </defs>
        <g filter="url(#crownShadow)">
            <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5z" fill="url(#crownGold)" />
            <circle cx="12" cy="15" r="1.5" fill="#F87171" stroke="white" strokeWidth="0.5"/>
            <circle cx="7" cy="12" r="1" fill="#3B82F6" stroke="white" strokeWidth="0.5"/>
            <circle cx="17" cy="12" r="1" fill="#34D399" stroke="white" strokeWidth="0.5"/>
        </g>
    </svg>
);