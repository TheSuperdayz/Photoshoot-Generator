import React from 'react';

export const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={className}
        fill="none"
    >
        <defs>
            <linearGradient id="trashGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#F87171" />
                <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
            <filter id="trashShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0.5" dy="1" stdDeviation="1" floodColor="#000000" floodOpacity="0.2"/>
            </filter>
        </defs>
        <g filter="url(#trashShadow)">
            <path d="M3 6h18m-2 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="url(#trashGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 11v6m4-6v6" stroke="url(#trashGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" />
        </g>
    </svg>
);
