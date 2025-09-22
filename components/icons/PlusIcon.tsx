import React from 'react';

export const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={className}
        fill="none"
    >
        <defs>
            <linearGradient id="plusGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="white" />
                <stop offset="100%" stopColor="#E5E7EB" />
            </linearGradient>
            <filter id="plusShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0.5" dy="1" stdDeviation="1" floodColor="#000000" floodOpacity="0.1"/>
            </filter>
        </defs>
        <path
            d="M12 5V19M5 12H19"
            stroke="url(#plusGrad)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#plusShadow)"
        />
    </svg>
);
