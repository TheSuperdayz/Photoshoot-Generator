import React from 'react';

export const LightbulbIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        className={className} 
        fill="none"
    >
        <defs>
            <radialGradient id="bulbGlow" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="#FEF08A"/>
                <stop offset="100%" stopColor="#F59E0B"/>
            </radialGradient>
            <radialGradient id="bulbGlass" cx="0.4" cy="0.3" r="0.8">
                <stop offset="0%" stopColor="white" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="white" stopOpacity="0.1"/>
            </radialGradient>
            <linearGradient id="bulbBase" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E5E7EB"/>
                <stop offset="100%" stopColor="#9CA3AF"/>
            </linearGradient>
            <filter id="bulbShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#F59E0B" floodOpacity="0.4"/>
            </filter>
        </defs>
        <g filter="url(#bulbShadow)">
            <path d="M12 2C8.68629 2 6 4.68629 6 8C6 10.2913 7.21113 12.2573 9 13.3416V16H15V13.3416C16.7889 12.2573 18 10.2913 18 8C18 4.68629 15.3137 2 12 2Z" fill="url(#bulbGlow)"/>
            <path d="M12 2C8.68629 2 6 4.68629 6 8C6 10.2913 7.21113 12.2573 9 13.3416V16H15V13.3416C16.7889 12.2573 18 10.2913 18 8C18 4.68629 15.3137 2 12 2Z" fill="url(#bulbGlass)"/>
            <rect x="8" y="16" width="8" height="2" rx="1" fill="url(#bulbBase)"/>
            <rect x="9" y="18" width="6" height="3" rx="1.5" fill="url(#bulbBase)"/>
        </g>
    </svg>
);
