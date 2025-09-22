import React from 'react';

export const ImageIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        className={className} 
        fill="none"
    >
        <defs>
            <linearGradient id="imgFrame" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#F472B6"/>
                <stop offset="100%" stopColor="#FB923C"/>
            </linearGradient>
            <linearGradient id="imgSky" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#7DD3FC"/>
                <stop offset="100%" stopColor="#38BDF8"/>
            </linearGradient>
            <linearGradient id="imgMountain" x1="0.5" y1="0" x2="0.5" y2="1">
                <stop offset="0%" stopColor="#34D399"/>
                <stop offset="100%" stopColor="#10B981"/>
            </linearGradient>
             <filter id="imgShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#000" floodOpacity="0.2"/>
            </filter>
        </defs>
        <g filter="url(#imgShadow)">
            <rect x="2" y="4" width="20" height="16" rx="3" fill="url(#imgFrame)"/>
            <rect x="4" y="6" width="16" height="12" rx="1" fill="url(#imgSky)"/>
            <path d="M4 18L10 12L14 16L16 14L20 18H4Z" fill="url(#imgMountain)"/>
            <circle cx="9" cy="10" r="1.5" fill="#FBBF24"/>
        </g>
    </svg>
);
