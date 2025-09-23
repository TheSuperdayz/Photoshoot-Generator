import React from 'react';

export const TestTubeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        className={className} 
        fill="none"
    >
        <defs>
            <linearGradient id="tubeLiquid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34D399"/>
                <stop offset="100%" stopColor="#10B981"/>
            </linearGradient>
            <linearGradient id="tubeGlass" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="white" stopOpacity="0.4"/>
                <stop offset="100%" stopColor="white" stopOpacity="0.1"/>
            </linearGradient>
            <filter id="tubeShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#000" floodOpacity="0.2"/>
            </filter>
        </defs>
        <g filter="url(#tubeShadow)">
            {/* Liquid */}
            <path d="M9 21H15C15 17 12 15 12 15C12 15 9 17 9 21Z" fill="url(#tubeLiquid)"/>
            
            {/* Bubbles */}
            <circle cx="11" cy="18" r="0.8" fill="white" opacity="0.5"/>
            <circle cx="13" cy="20" r="0.5" fill="white" opacity="0.6"/>
            <circle cx="12.5" cy="17" r="0.6" fill="white" opacity="0.4"/>

            {/* Glass Tube */}
            <path d="M15 21H9V10.7203C9.58986 10.5752 10.2643 10.2312 10.8284 9.66699L12 8.49541L13.1716 9.66699C14.2929 10.7883 15 12.3435 15 14V21Z" fill="url(#tubeGlass)"/>
            <path d="M16 3H8V9.58579C8 10.1161 8.21071 10.6254 8.58579 11L12 14.4142L15.4142 11C15.7893 10.6254 16 10.1161 16 9.58579V3Z" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
    </svg>
);