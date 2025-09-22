import React from 'react';

export const HistoryIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={className}
        fill="none"
    >
        <defs>
            <linearGradient id="historyGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#A78BFA" />
                <stop offset="100%" stopColor="#F472B6" />
            </linearGradient>
            <radialGradient id="historyShine" cx="0.3" cy="0.3" r="0.8">
                <stop offset="0%" stopColor="white" stopOpacity="0.4" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
            <filter id="historyShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.2"/>
            </filter>
        </defs>
        <g filter="url(#historyShadow)">
            <circle cx="12" cy="12" r="9" fill="url(#historyGrad)" />
            <path d="M12 7V12H16" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="9" fill="url(#historyShine)" />
        </g>
    </svg>
);
