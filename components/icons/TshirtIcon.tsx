import React from 'react';

export const TshirtIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        className={className} 
        fill="none"
    >
        <defs>
            <linearGradient id="tshirtGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#60A5FA"/>
                <stop offset="100%" stopColor="#3B82F6"/>
            </linearGradient>
             <filter id="tshirtShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#000" floodOpacity="0.2"/>
            </filter>
        </defs>
        <g filter="url(#tshirtShadow)">
            <path d="M12 2L3.5 5.5L4 8L6 7.5V20C6 21.1046 6.89543 22 8 22H16C17.1046 22 18 21.1046 18 20V7.5L20 8L20.5 5.5L12 2Z" fill="url(#tshirtGrad)"/>
            <path d="M12 2L10 6C10 6 10.5 6.5 12 6.5C13.5 6.5 14 6 14 6L12 2Z" fill="black" opacity="0.1"/>
        </g>
    </svg>
);
