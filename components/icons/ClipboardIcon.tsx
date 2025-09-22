import React from 'react';

export const ClipboardIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        className={className} 
        fill="none"
    >
        <defs>
            <linearGradient id="clipGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#7DD3FC"/>
                <stop offset="100%" stopColor="#F472B6"/>
            </linearGradient>
            <linearGradient id="clipMetal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E5E7EB"/>
                <stop offset="100%" stopColor="#D1D5DB"/>
            </linearGradient>
             <filter id="clipShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0.5" dy="1" stdDeviation="1" floodColor="#000" floodOpacity="0.15"/>
            </filter>
        </defs>
        <g filter="url(#clipShadow)">
            <rect x="5" y="4" width="14" height="18" rx="2" fill="url(#clipGrad)"/>
            <path d="M9 3C9 2.44772 9.44772 2 10 2H14C14.5523 2 15 2.44772 15 3V5H9V3Z" fill="url(#clipMetal)"/>
        </g>
    </svg>
);
