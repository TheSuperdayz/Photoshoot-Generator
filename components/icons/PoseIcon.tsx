import React from 'react';

export const PoseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        className={className} 
        fill="none"
    >
        <defs>
            <linearGradient id="poseGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#34D399" />
                <stop offset="100%" stopColor="#22D3EE" />
            </linearGradient>
            <filter id="poseShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#000" floodOpacity="0.2"/>
            </filter>
        </defs>
        <g filter="url(#poseShadow)">
            <circle cx="12" cy="5" r="3" fill="url(#poseGrad)" />
            <path d="M12 8L12 14" stroke="url(#poseGrad)" strokeWidth="3" strokeLinecap="round"/>
            <path d="M9 11L12 14L15 11" stroke="url(#poseGrad)" strokeWidth="3" strokeLinecap="round"/>
            <path d="M9 21L12 14L15 21" stroke="url(#poseGrad)" strokeWidth="3" strokeLinecap="round"/>
            <path d="M18 15L21 18" stroke="url(#poseGrad)" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 2" opacity="0.7"/>
            <path d="M6 15L3 18" stroke="url(#poseGrad)" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 2" opacity="0.7"/>
        </g>
    </svg>
);