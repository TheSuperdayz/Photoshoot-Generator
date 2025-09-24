
import React from 'react';

export const ErrorIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={className}
        fill="none"
    >
        <defs>
            <linearGradient id="errorGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#F87171" />
                <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
            <filter id="errorShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0.5" dy="1" stdDeviation="1" floodColor="#000000" floodOpacity="0.2"/>
            </filter>
        </defs>
        <g filter="url(#errorShadow)">
            <circle cx="12" cy="12" r="10" fill="url(#errorGrad)" />
            <path d="M12 7V13" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="12" cy="16.5" r="1.5" fill="white"/>
        </g>
    </svg>
);
