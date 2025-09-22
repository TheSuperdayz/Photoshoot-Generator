import React from 'react';

export const PencilIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={className}
        fill="none"
    >
        <defs>
            <linearGradient id="pencilBody" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
            <linearGradient id="pencilMetal" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#E5E7EB" />
                <stop offset="100%" stopColor="#D1D5DB" />
            </linearGradient>
            <filter id="pencilShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="1" dy="1" stdDeviation="1" floodColor="#000000" floodOpacity="0.2"/>
            </filter>
        </defs>
        <g transform="rotate(45 12 12)" filter="url(#pencilShadow)">
            <path d="M19 6L14 1L12 3L17 8L19 6Z" fill="#FBCFE8" />
            <path d="M14 1L3 12L8 17L19 6L14 1Z" fill="url(#pencilBody)" />
            <path d="M3 12L8 17L6 19L1 14L3 12Z" fill="#4B5563" />
            <rect x="9" y="8" width="5" height="10" transform="rotate(-45 9 8)" fill="url(#pencilMetal)" />
        </g>
    </svg>
);
