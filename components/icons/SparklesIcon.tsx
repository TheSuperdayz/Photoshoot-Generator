import React from 'react';

export const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={className}
        fill="none"
    >
        <defs>
            <linearGradient id="sparkleGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FDE047" />
                <stop offset="100%" stopColor="#FBBF24" />
            </linearGradient>
             <filter id="sparkleShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0.5" dy="1" stdDeviation="1" floodColor="#000000" floodOpacity="0.2"/>
            </filter>
        </defs>
        <g filter="url(#sparkleShadow)">
            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="url(#sparkleGrad)" />
            <path d="M5 2L6 5L9 6L6 7L5 10L4 7L1 6L4 5L5 2Z" fill="url(#sparkleGrad)" opacity="0.7" />
             <path d="M19 15L20 18L23 19L20 20L19 23L18 20L15 19L18 18L19 15Z" fill="url(#sparkleGrad)" opacity="0.7" />
        </g>
    </svg>
);
