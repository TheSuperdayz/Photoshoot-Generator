import React from 'react';

export const JourneyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        className={className} 
        fill="none"
    >
        <defs>
            <linearGradient id="journeyPath" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#38BDF8"/>
                <stop offset="100%" stopColor="#A78BFA"/>
            </linearGradient>
            <linearGradient id="journeyStar" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FDE047"/>
                <stop offset="100%" stopColor="#FBBF24"/>
            </linearGradient>
            <filter id="journeyShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#000" floodOpacity="0.2"/>
            </filter>
        </defs>
        <g filter="url(#journeyShadow)">
            <path d="M4 19.5C4 19.5 5.5 15.5 9.5 15.5C13.5 15.5 14.5 12.5 18.5 12.5C22.5 12.5 24 10.5 24 10.5" stroke="url(#journeyPath)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 4.5L6.5 11.5L14 13.5L11.5 6.5L4 4.5Z" fill="url(#journeyStar)"/>
        </g>
    </svg>
);