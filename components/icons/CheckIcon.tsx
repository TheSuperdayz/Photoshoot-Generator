import React from 'react';

export const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={className}
        fill="none"
    >
        <defs>
            <linearGradient id="checkGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#4ADE80" />
                <stop offset="100%" stopColor="#34D399" />
            </linearGradient>
            <filter id="checkShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0.5" dy="1" stdDeviation="1" floodColor="#000000" floodOpacity="0.2"/>
            </filter>
        </defs>
        <path
            d="M20.25 7.5L9.75 18L4.5 12.75"
            stroke="url(#checkGrad)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#checkShadow)"
        />
    </svg>
);
