import React from 'react';

export const StrategyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={className}
        fill="none"
    >
        <defs>
            <linearGradient id="strategyGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#E5E7EB" />
                <stop offset="100%" stopColor="#BCC1C9" />
            </linearGradient>
            <filter id="strategyShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#000" floodOpacity="0.2"/>
            </filter>
        </defs>
        <g filter="url(#strategyShadow)">
            <path d="M18 8.5c0 4.5-4 8-6 8s-6-3.5-6-8c0-2 2-3.5 3-4.5s2.5-1.5 3-1.5 2 0.5 3 1.5 3 2.5 3 4.5z" fill="url(#strategyGrad)"/>
            <path d="M6 18h12v2H6v-2z" fill="url(#strategyGrad)" />
            <rect x="7" y="16.5" width="10" height="1.5" rx="0.75" fill="black" opacity="0.1" />
             <path d="M12 2.5a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0v-1a1 1 0 0 1 1-1zM10.5 2h3M12 2.5L10 1.5M12 2.5L14 1.5" stroke="url(#strategyGrad)" strokeWidth="1" strokeLinecap="round" />
        </g>
    </svg>
);
