import React from 'react';

export const RadarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={className}
        fill="none"
    >
        <defs>
            <linearGradient id="radarGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#34D399" />
                <stop offset="100%" stopColor="#22D3EE" />
            </linearGradient>
            <filter id="radarShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#000" floodOpacity="0.2"/>
            </filter>
        </defs>
        <g filter="url(#radarShadow)">
            <path d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20" stroke="url(#radarGrad)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1 4" />
             <path d="M12 4C9.17253 4 6.64372 5.61754 5.25 7.99924" stroke="url(#radarGrad)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1 4" />
            <path d="M12 4V12H20" stroke="url(#radarGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="2" fill="url(#radarGrad)" />
        </g>
    </svg>
);
