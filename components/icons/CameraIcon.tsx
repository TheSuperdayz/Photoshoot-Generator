import React from 'react';

export const CameraIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        className={className} 
        fill="none"
    >
        <defs>
            <radialGradient id="lensFlare" cx="0.4" cy="0.4" r="0.6">
                <stop offset="0%" stopColor="white" stopOpacity="0.7"/>
                <stop offset="100%" stopColor="white" stopOpacity="0"/>
            </radialGradient>
            <linearGradient id="cameraBody" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#818CF8"/>
                <stop offset="100%" stopColor="#A78BFA"/>
            </linearGradient>
             <filter id="cameraShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#000" floodOpacity="0.2"/>
            </filter>
        </defs>
        <g filter="url(#cameraShadow)">
            <rect x="2" y="6" width="20" height="14" rx="3" fill="url(#cameraBody)"/>
            <circle cx="12" cy="13" r="5" fill="#2E1065"/>
            <circle cx="12" cy="13" r="3" fill="#4C1D95"/>
            <circle cx="12" cy="13" r="4.5" fill="url(#lensFlare)"/>
            <circle cx="18" cy="9" r="1" fill="#4C1D95"/>
        </g>
    </svg>
);
